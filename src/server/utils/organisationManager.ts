import { Prisma, Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import { miscTypes, organisationTypes } from '~/shared/types'
import type { OrganisationRepresentation } from './keycloak'
import { toSlug } from '~/utils/misc'

enum SyncStatus {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  NOT_AFFECTED = 'NOT_AFFECTED',
}

interface Affected {
  created: Prisma.OrganisationGetPayload<typeof db.organisation.args.all>[]
  updated: Prisma.OrganisationGetPayload<typeof db.organisation.args.all>[]
  deleted: Prisma.OrganisationGetPayload<typeof db.organisation.args.all>[]
}

class OrganisationManager {
  create = async (event: H3Event<EventHandlerRequest>, data: organisationTypes.CreateBodyMaster) => {
    const kcOrganisation: OrganisationRepresentation = {
      name: data.name,
      alias: toSlug(data.name),
      redirectUrl: data.redirectUrl,
      domains: [
        {
          name: data.domain,
          verified: true,
        },
      ],
    }
    try {
      const existingKcOrganisation = await keycloak.getOrganisationByName(event, kcOrganisation.name!, data.realm)
      return db.organisation.queries.upsert(existingKcOrganisation.id!, data.realm, kcOrganisation, db.organisation.args.all)
    } catch (error) {
      if (error instanceof ApplicationError && error.statusCode === HttpStatusCode.NOT_FOUND) {
        const newKcOrganisation = await keycloak.createOrganisation(event, kcOrganisation, data.realm)
        try {
          return db.organisation.queries.upsert(newKcOrganisation.id!, data.realm, kcOrganisation, db.organisation.args.all)
        } catch (error) {
          await keycloak.deleteOrganisation(event, newKcOrganisation.id!, data.realm)
          throw error
        }
      }
      throw error
    }
  }

  syncWithKc = async (event: H3Event<EventHandlerRequest>) => {
    const realms = miscTypes.clientRealms
    const affected: Affected = { created: [], updated: [], deleted: [] }
    for (const realm of realms) {
      const allKcOrganisations = await keycloak.getOrganisations(event, realm)
      const organisationsAffected: Affected = { created: [], updated: [], deleted: [] }

      for (const kcOrganisation of allKcOrganisations) {
        const { organisation, status } = await _updateOrganisationToMatchKcOrganisation(realm, kcOrganisation)
        if (status === SyncStatus.CREATED) organisationsAffected.created.push(organisation)
        if (status === SyncStatus.UPDATED) organisationsAffected.updated.push(organisation)
      }

      affected.created.push(...organisationsAffected.created)
      affected.updated.push(...organisationsAffected.updated)
      affected.deleted.push(...(await _deleteOrganisationsNotInKcOrganisations(realm, allKcOrganisations)))
    }
    return affected
  }

  update = async (event: H3Event<EventHandlerRequest>, organisationId: string, data: organisationTypes.UpdateBodyMaster) => {
    const organisation = await db.organisation.queries.get(organisationId, db.organisation.args.all)
    const name = data.name ?? organisation.name

    // This is a workaround for the Keycloak API, which requires a token from the master realm util RBAC allows organisation management
    const { access_token } = await keycloak.getMasterToken(event)
    const kcOrganisation: OrganisationRepresentation = {
      ...(await keycloak.getOrganisationById(event, organisation.kcId, organisation.realm, access_token)),
      name,
    }
    await keycloak.updateOrganisation(event, kcOrganisation.id!, kcOrganisation, organisation.realm, access_token)
    return await db.organisation.queries.upsert(kcOrganisation.id!, organisation.realm, kcOrganisation, db.organisation.args.all)
  }

  delete = async (event: H3Event<EventHandlerRequest>, organisationId: string) => {
    const organisation = await db.organisation.queries.get(organisationId, db.organisation.args.all)
    await keycloak.deleteOrganisation(event, organisation.kcId, organisation.realm)
    return await db.organisation.queries.delete(organisationId, db.organisation.args.all)
  }
}

// Private functions

async function _deleteOrganisationsNotInKcOrganisations(realm: Realm, kcOrganisations: OrganisationRepresentation[]) {
  const organisations = await db.organisation.queries.getAllRealm(realm, db.organisation.args.all)
  const organisationsToDelete = organisations.filter((o) => !kcOrganisations.find((kcOrganisations) => kcOrganisations.id === o.kcId))
  const deletedOrganisations = []
  for (const organisation of organisationsToDelete) {
    deletedOrganisations.push(await db.organisation.queries.delete(organisation.id, db.organisation.args.all))
  }
  return deletedOrganisations
}

async function _updateOrganisationToMatchKcOrganisation(realm: Realm, kcOrganisation: OrganisationRepresentation) {
  if (!kcOrganisation.id) {
    throw new ApplicationError('Missing organisation ID', HttpStatusCode.BAD_REQUEST)
  }

  try {
    const organisation = await db.organisation.queries.getByKcId(kcOrganisation.id!, db.organisation.args.all)
    if (await _checkIfOrganisationNeedsSyncing(kcOrganisation, organisation)) {
      return {
        organisation: await db.organisation.queries.upsert(kcOrganisation.id!, realm, kcOrganisation, db.organisation.args.all),
        status: SyncStatus.UPDATED,
      }
    }
    return { organisation, status: SyncStatus.NOT_AFFECTED }
  } catch (error) {
    if (error instanceof DatabaseError && error.statusCode === HttpStatusCode.NOT_FOUND) {
      return {
        organisation: await db.organisation.queries.upsert(kcOrganisation.id!, realm, kcOrganisation, db.organisation.args.all),
        status: SyncStatus.CREATED,
      }
    }
    throw error
  }
}

async function _checkIfOrganisationNeedsSyncing(
  kcOrganisation: OrganisationRepresentation,
  organisation: Prisma.OrganisationGetPayload<typeof db.organisation.args.all>
) {
  return !organisation || organisation.name !== kcOrganisation.name
}

export const organisationManager = new OrganisationManager()
