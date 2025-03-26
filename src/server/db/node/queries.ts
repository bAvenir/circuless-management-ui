import { Prisma, Realm } from '@prisma/client'
import prisma from '~/lib/prisma'
import { nodeTypes } from '~/shared/types'

export const NodeQueries = {
  async create<T extends Prisma.NodeDefaultArgs>(data: nodeTypes.CreateBodyMaster, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.create({
          data,
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>
    )
  },

  async get<T extends Prisma.NodeDefaultArgs>(id: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.findUniqueOrThrow({
          where: { id },
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>
    )
  },

  async getAll<T extends Prisma.NodeDefaultArgs>(args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.findMany({
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>[]
    )
  },

  async getRealm<T extends Prisma.NodeDefaultArgs>(id: string, realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.findUniqueOrThrow({
          where: { id, realm },
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>
    )
  },

  async getAllRealm<T extends Prisma.NodeDefaultArgs>(realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.findMany({
          where: { realm },
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>[]
    )
  },

  async getUserRealm<T extends Prisma.NodeDefaultArgs>(id: string, userId: string, realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.findUniqueOrThrow({
          where: {
            id,
            realm,
            owner: {
              users: {
                some: {
                  id: userId,
                },
              },
            },
          },
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>
    )
  },

  async getAllUserRealm<T extends Prisma.NodeDefaultArgs>(userId: string, realm: Realm, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.findMany({
          where: {
            owner: {
              users: {
                some: { id: userId },
              },
            },
            realm,
          },
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>[]
    )
  },

  async delete<T extends Prisma.NodeDefaultArgs>(id: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.node.delete({
          where: { id },
          ...args,
        })) as unknown as Prisma.NodeGetPayload<T>
    )
  },
}
