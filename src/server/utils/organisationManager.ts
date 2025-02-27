import { Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import prisma from '~/lib/prisma'
import { organisationTypes } from '~/shared/types'
import type { OrganisationRepresentation } from './auth'
import { toSlug } from './misc'

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
    return await createOrUpdateOrganisation(event, kcOrganisation, data.realm)
  }

  delete = async (event: H3Event<EventHandlerRequest>, organisationId: string) => {
    return await deleteOrganisation(event, organisationId)
  }
}

async function createOrUpdateOrganisation(event: H3Event<EventHandlerRequest>, kcOrganisation: OrganisationRepresentation, realm: Realm) {
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
