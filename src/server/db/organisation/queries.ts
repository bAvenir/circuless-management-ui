import { Prisma, Realm } from '@prisma/client'
import prisma from '~/lib/prisma'
import type { OrganisationRepresentation } from '~/server/utils/auth'

export const OrganisationQueries = {
  async upsert<T extends Prisma.OrganisationDefaultArgs>(kcId: string, realm: Realm, data: OrganisationRepresentation, args?: T) {
    const { name, alias } = data
    return queryWrapper(
      async () =>
        (await prisma.organisation.upsert({
          where: { kcId },
          create: {
            name,
            alias,
            kcId,
            realm,
          },
          update: {
            name,
            alias,
          },
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>
    )
  },

  async getAll<T extends Prisma.OrganisationDefaultArgs>(args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.organisation.findMany({
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>[]
    )
  },

  async getAllRealm<T extends Prisma.OrganisationDefaultArgs>(realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.organisation.findMany({
          where: { realm },
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>[]
    )
  },

  async get<T extends Prisma.OrganisationDefaultArgs>(id: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.organisation.findUniqueOrThrow({
          where: { id },
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>
    )
  },

  async getByKcId<T extends Prisma.OrganisationDefaultArgs>(kcId: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.organisation.findUniqueOrThrow({
          where: { kcId },
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>
    )
  },

  async getRealm<T extends Prisma.OrganisationDefaultArgs>(id: string, realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.organisation.findUniqueOrThrow({
          where: { id, realm },
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>
    )
  },

  async delete<T extends Prisma.OrganisationDefaultArgs>(id: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.organisation.delete({
          where: { id },
          ...args,
        })) as unknown as Prisma.OrganisationGetPayload<T>
    )
  },
}
