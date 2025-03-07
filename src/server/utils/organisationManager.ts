import { Prisma, Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import prisma from '~/lib/prisma'
import { miscTypes, organisationTypes } from '~/shared/types'
import type { OrganisationRepresentation } from './auth'
import { toSlug } from './misc'

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
    return await createOrganisation(event, kcOrganisation, data.realm)
  }

  syncAllOrganisationsWithKc = async (event: H3Event<EventHandlerRequest>) => {
    const realms = miscTypes.clientRealms
    const affected: Affected = { created: [], updated: [], deleted: [] }
    for (const realm of realms) {
      const allKcOrganisations = await auth.getOrganisations(event, realm)
      const organisationsAffected = await updateAllOrganisationsToMatchKcOrganisations(event, realm, allKcOrganisations)
      affected.created.push(...organisationsAffected.created)
      affected.updated.push(...organisationsAffected.updated)
      affected.deleted.push(...(await deleteOrganisationsNotInKcOrganisations(event, realm, allKcOrganisations)))
    }
    return affected
  }

  delete = async (event: H3Event<EventHandlerRequest>, organisationId: string) => {
    return await deleteOrganisation(event, organisationId)
  }
}

async function updateAllOrganisationsToMatchKcOrganisations(
  event: H3Event<EventHandlerRequest>,
  realm: Realm,
  kcOrganisatons: OrganisationRepresentation[]
) {
  const affected: Affected = { created: [], updated: [], deleted: [] }
  for (const kcOrganisation of kcOrganisatons) {
    const { organisation, status } = await updateOrganisationToMatchKcOrganisation(event, realm, kcOrganisation)
    if (status === SyncStatus.CREATED) affected.created.push(organisation)
    if (status === SyncStatus.UPDATED) affected.updated.push(organisation)
  }
  return affected
}

async function deleteOrganisationsNotInKcOrganisations(
  event: H3Event<EventHandlerRequest>,
  realm: Realm,
  kcOrganisations: OrganisationRepresentation[]
) {
  const organisations = await db.organisation.queries.getAllRealm(realm, db.organisation.args.all)
  const organisationsToDelete = organisations.filter((o) => !kcOrganisations.find((kcOrganisations) => kcOrganisations.id === o.kcId))
  const deletedOrganisations = []
  for (const organisation of organisationsToDelete) {
    deletedOrganisations.push(await db.organisation.queries.delete(organisation.id, db.organisation.args.all))
  }
  return deletedOrganisations
}

async function updateOrganisationToMatchKcOrganisation(
  event: H3Event<EventHandlerRequest>,
  realm: Realm,
  kcOrganisation: OrganisationRepresentation
) {
  if (!kcOrganisation.id) {
    throw new ApplicationError('Missing organisation ID', HttpStatusCode.BAD_REQUEST)
  }

  try {
    const organisation = await db.organisation.queries.getByKcId(kcOrganisation.id!, db.organisation.args.all)
    if (await checkIfOrganisationNeedsSyncing(kcOrganisation, organisation)) {
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

async function checkIfOrganisationNeedsSyncing(
  kcOrganisation: OrganisationRepresentation,
  organisation: Prisma.OrganisationGetPayload<typeof db.organisation.args.all>
) {
  return !organisation || organisation.name !== kcOrganisation.name
}

async function createOrganisation(event: H3Event<EventHandlerRequest>, kcOrganisation: OrganisationRepresentation, realm: Realm) {
  try {
    const existingKcOrganisation = await auth.getOrganisationByName(event, kcOrganisation.name, realm)
    return db.organisation.queries.upsert(existingKcOrganisation.id!, realm, kcOrganisation, db.organisation.args.all)
  } catch (error) {
    if (error instanceof ApplicationError && error.statusCode === HttpStatusCode.NOT_FOUND) {
      const newKcOrganisation = await auth.createOrganisation(event, kcOrganisation, realm)
      try {
        return db.organisation.queries.upsert(newKcOrganisation.id!, realm, kcOrganisation, db.organisation.args.all)
      } catch (error) {
        await auth.deleteOrganisation(event, newKcOrganisation.id!, realm)
        throw error
      }
    }
    throw error
  }
}

async function deleteOrganisation(event: H3Event<EventHandlerRequest>, organisationId: string) {
  return await prisma.$transaction(async (tx) => {
    const organisation = await db.organisation.queries.delete(organisationId, db.organisation.args.all)
    await auth.deleteOrganisation(event, organisation.kcId, organisation.realm)
    return organisation
  })
}

export const organisationManager = new OrganisationManager()
