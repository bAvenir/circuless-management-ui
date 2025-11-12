import { Prisma, Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import { miscTypes, userTypes } from '~/shared/types'
import type {
    InviteRepresentation,
    MemberRepresentation,
    OrganisationRepresentation,
} from './keycloak'
import type { ParsedOrganizationClaim } from '../types/jwt'

enum SyncStatus {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    NOT_AFFECTED = 'NOT_AFFECTED',
}

interface KcUsersWithOrganisation {
    users: MemberRepresentation[]
    organisation?: OrganisationRepresentation
}

interface Affected {
    created: Prisma.UserGetPayload<typeof db.user.args.all>[]
    updated: Prisma.UserGetPayload<typeof db.user.args.all>[]
    deleted: Prisma.UserGetPayload<typeof db.user.args.all>[]
}

class UserManager {
    invite = async (
        event: H3Event<EventHandlerRequest>,
        data: userTypes.InviteData
    ) => {
        const invite: InviteRepresentation = {
            email: data.email,
            firstName: data.givenName,
            lastName: data.familyName,
        }
        // This is a workaround for the Keycloak API, which requires a token from the master realm util RBAC allows organisation management
        const { access_token } = await keycloak.getMasterToken(event)
        await keycloak.inviteUserToOrganisation(
            event,
            invite,
            data.kcOrganisationId,
            data.realm,
            access_token
        )
    }

    syncWithKc = async (event: H3Event<EventHandlerRequest>) => {
        const realms = miscTypes.clientRealms
        const affected: Affected = { created: [], updated: [], deleted: [] }
        for (const realm of realms) {
            const kcOrganisatoins = await keycloak.getOrganisations(
                event,
                realm
            )
            let kcUsers = await keycloak.getUsers(event, realm)
            const kcUsersWithOrganisation: KcUsersWithOrganisation[] = []

            const allKcUsers = [...kcUsers]

            // Sort users into organisations
            for (const kcOrganisation of kcOrganisatoins) {
                const members = await keycloak.getOrganisationMembers(
                    event,
                    kcOrganisation.id!,
                    realm
                )
                kcUsersWithOrganisation.push({
                    users: members,
                    organisation: kcOrganisation,
                })
                kcUsers = kcUsers.filter(
                    (u) => !members.find((m) => m.id === u.id)
                )
            }
            // Add users without organisation
            kcUsersWithOrganisation.push({ users: kcUsers })

            for (const kcUsers of kcUsersWithOrganisation) {
                const usersAffected: Affected = {
                    created: [],
                    updated: [],
                    deleted: [],
                }

                for (const kcUser of kcUsers.users) {
                    const { user, status } = await _updateUserToMatchKcUser(
                        realm,
                        kcUser,
                        kcUsers.organisation
                    )
                    if (status === SyncStatus.CREATED)
                        usersAffected.created.push(user)
                    if (status === SyncStatus.UPDATED)
                        usersAffected.updated.push(user)
                }

                affected.created.push(...usersAffected.created)
                affected.updated.push(...usersAffected.updated)
            }
            affected.deleted.push(
                ...(await _deleteUsersNotInKcUsers(realm, allKcUsers))
            )
        }
        return affected
    }

    syncMyUserWithKc = async (
        event: H3Event<EventHandlerRequest>,
        realm: Realm
    ) => {
        const {
            sub,
            email,
            given_name: givenName,
            family_name: familyName,
            kcOrganisation,
        } = keycloak.validateClaims(event)
        const kcUser: MemberRepresentation = {
            id: sub,
            username: email,
            email,
            firstName: givenName,
            lastName: familyName,
        }
        return await _updateUserToMatchKcUser(realm, kcUser, kcOrganisation)
    }

    delete = async (event: H3Event<EventHandlerRequest>, userId: string) => {
        const user = await db.user.queries.get(userId, db.user.args.all)
        await keycloak.deleteUser(event, user.kcId, user.realm)
        return await db.user.queries.delete(userId, db.user.args.all)
    }
}

// Private functions

async function _deleteUsersNotInKcUsers(
    realm: Realm,
    kcUsers: MemberRepresentation[]
) {
    const users = await db.user.queries.getAllRealm(realm, db.user.args.all)
    const usersToDelete = users.filter(
        (u) => !kcUsers.find((kcUser) => kcUser.id === u.kcId)
    )
    const deletedUsers = []
    for (const user of usersToDelete) {
        deletedUsers.push(
            await db.user.queries.delete(user.id, db.user.args.all)
        )
    }
    return deletedUsers
}

async function _updateUserToMatchKcUser(
    realm: Realm,
    kcUser: MemberRepresentation,
    kcOrganisation?: ParsedOrganizationClaim | OrganisationRepresentation
) {
    if (!kcUser.id) {
        throw new ApplicationError(
            'Missing user ID',
            HttpStatusCode.BAD_REQUEST
        )
    }
    if (kcOrganisation && !kcOrganisation.id) {
        throw new ApplicationError(
            'Missing organisation ID',
            HttpStatusCode.BAD_REQUEST
        )
    }

    try {
        const user = await db.user.queries.getByKcId(
            kcUser.id!,
            db.user.args.all
        )
        if (await _checkIfUserNeedsSyncing(kcUser, user, kcOrganisation)) {
            return {
                user: await db.user.queries.upsert(
                    kcUser.id!,
                    realm,
                    kcUser,
                    kcOrganisation?.id,
                    db.user.args.all
                ),
                status: SyncStatus.UPDATED,
            }
        }
        return { user, status: SyncStatus.NOT_AFFECTED }
    } catch (error) {
        if (
            error instanceof DatabaseError &&
            error.statusCode === HttpStatusCode.NOT_FOUND
        ) {
            return {
                user: await db.user.queries.upsert(
                    kcUser.id!,
                    realm,
                    kcUser,
                    kcOrganisation?.id,
                    db.user.args.all
                ),
                status: SyncStatus.CREATED,
            }
        }
        throw error
    }
}

async function _checkIfUserNeedsSyncing(
    kcUser: MemberRepresentation,
    user: Prisma.UserGetPayload<typeof db.user.args.all>,
    kcOrganisation?: ParsedOrganizationClaim | OrganisationRepresentation
) {
    return (
        !user ||
        user.email !== kcUser.email ||
        user.givenName !== kcUser.firstName ||
        user.familyName !== kcUser.lastName ||
        (kcOrganisation && user.organisation?.kcId !== kcOrganisation.id) ||
        (user.organisation && !kcOrganisation)
    )
}

export const userManager = new UserManager()
