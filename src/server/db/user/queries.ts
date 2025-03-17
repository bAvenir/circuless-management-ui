import { Prisma, Realm } from '@prisma/client'
import prisma from '~/lib/prisma'
import type { MemberRepresentation } from '~/server/utils/keycloak'

export const UserQueries = {
  async upsert<T extends Prisma.UserDefaultArgs>(kcId: string, realm: Realm, data: MemberRepresentation, kcOrganisationId?: string, args?: T) {
    const { id, username, ...rest } = data
    return queryWrapper(
      async () =>
        (await prisma.user.upsert({
          where: { kcId },
          create: {
            email: data.email,
            givenName: data.firstName,
            familyName: data.lastName,
            kcId,
            realm,
            organisation: kcOrganisationId
              ? {
                  connect: {
                    kcId: kcOrganisationId,
                  },
                }
              : undefined,
          },
          update: {
            email: data.email,
            givenName: data.firstName,
            familyName: data.lastName,
            organisation: kcOrganisationId
              ? {
                  connect: {
                    kcId: kcOrganisationId,
                  },
                }
              : {
                  disconnect: true,
                },
          },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>
    )
  },

  async getAll<T extends Prisma.UserDefaultArgs>(args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.findMany({
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>[]
    )
  },

  async getAllRealm<T extends Prisma.UserDefaultArgs>(realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.findMany({
          where: {
            realm,
          },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>[]
    )
  },

  async get<T extends Prisma.UserDefaultArgs>(id: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.findUniqueOrThrow({
          where: { id },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>
    )
  },

  async getRealm<T extends Prisma.UserDefaultArgs>(id: string, realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.findUniqueOrThrow({
          where: { id, realm },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>
    )
  },

  async getByKcId<T extends Prisma.UserDefaultArgs>(kcId: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.findUniqueOrThrow({
          where: { kcId },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>
    )
  },

  async getByEmailAndRealm<T extends Prisma.UserDefaultArgs>(email: string, realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.findUniqueOrThrow({
          where: {
            email_realm: {
              email,
              realm,
            },
          },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>
    )
  },

  async delete<T extends Prisma.UserDefaultArgs>(id: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.user.delete({
          where: { id },
          ...args,
        })) as unknown as Prisma.UserGetPayload<T>
    )
  },

  async emailExistsInRealm(email: string, realm: Realm) {
    return queryWrapper(
      async () =>
        (await prisma.user.count({
          where: {
            email,
            realm,
          },
        })) > 0
    )
  },
}
