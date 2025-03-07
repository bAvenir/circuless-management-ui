import { Prisma, Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import prisma from '~/lib/prisma'
import { miscTypes, userTypes } from '~/shared/types'
import type { InviteRepresentation, MemberRepresentation, OrganisationRepresentation } from './auth'
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
  invite = async (event: H3Event<EventHandlerRequest>, data: userTypes.InviteBody, accessToken?: string) => {
    const invite: InviteRepresentation = {
      email: data.email,
      firstName: data.givenName,
      lastName: data.familyName,
    }
    await auth.inviteUser(event, invite, data.kcOrganisationId, data.realm, accessToken)
  }

  syncAllUsersWithKc = async (event: H3Event<EventHandlerRequest>) => {
    const realms = miscTypes.clientRealms
    const affected: Affected = { created: [], updated: [], deleted: [] }
    for (const realm of realms) {
      const { allKcUsers, kcUsersWithOrganisation } = await this.getKcUsersWithOrganisation(event, realm)
      for (const kcUsers of kcUsersWithOrganisation) {
        const usersAffected = await updateAllUsersToMatchKcUsers(event, realm, kcUsers)
        affected.created.push(...usersAffected.created)
        affected.updated.push(...usersAffected.updated)
      }
      affected.deleted.push(...(await deleteUsersNotInKcUsers(event, realm, allKcUsers)))
    }
    return affected
  }

  syncMyUserWithKc = async (event: H3Event<EventHandlerRequest>, realm: Realm) => {
    const { sub, email, given_name: givenName, family_name: familyName, kcOrganisation } = auth.validateClaims(event)
    const kcUser: MemberRepresentation = {
      id: sub,
      username: email,
      email,
      firstName: givenName,
      lastName: familyName,
    }
    return await updateUserToMatchKcUser(event, realm, kcUser, kcOrganisation)
  }

  delete = async (event: H3Event<EventHandlerRequest>, userId: string) => {
    return await deleteUser(event, userId)
  }

  private getKcUsersWithOrganisation = async (event: H3Event<EventHandlerRequest>, realm: Realm) => {
    const kcOrganisatoins = await auth.getOrganisations(event, realm)
    let kcUsers = await auth.getUsers(event, realm)
    const kcUsersWithOrganisation: KcUsersWithOrganisation[] = []

    let allKcUsers = [...kcUsers]

    // Sort users into organisations
    for (const kcOrganisation of kcOrganisatoins) {
      const members = await auth.getOrganisationMembers(event, kcOrganisation.id!, realm)
      kcUsersWithOrganisation.push({ users: members, organisation: kcOrganisation })
      allKcUsers.push(...members)
      kcUsers = kcUsers.filter((u) => !members.find((m) => m.id === u.id))
    }
    // Add users without organisation
    kcUsersWithOrganisation.push({ users: kcUsers })

    return { allKcUsers, kcUsersWithOrganisation }
  }
}

async function updateAllUsersToMatchKcUsers(event: H3Event<EventHandlerRequest>, realm: Realm, kcUsers: KcUsersWithOrganisation) {
  const affected: Affected = { created: [], updated: [], deleted: [] }
  for (const kcUser of kcUsers.users) {
    const { user, status } = await updateUserToMatchKcUser(event, realm, kcUser, kcUsers.organisation)
    if (status === SyncStatus.CREATED) affected.created.push(user)
    if (status === SyncStatus.UPDATED) affected.updated.push(user)
  }
  return affected
}

async function deleteUsersNotInKcUsers(event: H3Event<EventHandlerRequest>, realm: Realm, kcUsers: MemberRepresentation[]) {
  const users = await db.user.queries.getAllRealm(realm, db.user.args.all)
  const usersToDelete = users.filter((u) => !kcUsers.find((kcUser) => kcUser.id === u.kcId))
  const deletedUsers = []
  for (const user of usersToDelete) {
    deletedUsers.push(await db.user.queries.delete(user.id, db.user.args.all))
  }
  return deletedUsers
}

async function updateUserToMatchKcUser(
  event: H3Event<EventHandlerRequest>,
  realm: Realm,
  kcUser: MemberRepresentation,
  kcOrganisation?: ParsedOrganizationClaim | OrganisationRepresentation
) {
  if (!kcUser.id) {
    throw new ApplicationError('Missing user ID', HttpStatusCode.BAD_REQUEST)
  }
  if (kcOrganisation && !kcOrganisation.id) {
    throw new ApplicationError('Missing organisation ID', HttpStatusCode.BAD_REQUEST)
  }

  try {
    const user = await db.user.queries.getByKcId(kcUser.id!, db.user.args.all)
    if (await checkIfUserNeedsSyncing(kcUser, user, kcOrganisation)) {
      return { user: await db.user.queries.upsert(kcUser.id!, realm, kcUser, kcOrganisation?.id, db.user.args.all), status: SyncStatus.UPDATED }
    }
    return { user, status: SyncStatus.NOT_AFFECTED }
  } catch (error) {
    if (error instanceof DatabaseError && error.statusCode === HttpStatusCode.NOT_FOUND) {
      return { user: await db.user.queries.upsert(kcUser.id!, realm, kcUser, kcOrganisation?.id, db.user.args.all), status: SyncStatus.CREATED }
    }
    throw error
  }
}

async function checkIfUserNeedsSyncing(
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

async function deleteUser(event: H3Event<EventHandlerRequest>, userId: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await db.user.queries.delete(userId, db.user.args.all)
    await auth.deleteUser(event, user.kcId, user.realm)
    return user
  })
}

export const userManager = new UserManager()
