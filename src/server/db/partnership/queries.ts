import { Prisma } from '@prisma/client'
import prisma from '~/lib/prisma'
import { partnershipTypes } from '~/shared/types'

export const PartnershipQueries = {
  async create<T extends Prisma.PartnershipDefaultArgs>(data: partnershipTypes.CreateData, args: T) {
    return queryWrapper(
      async () =>
        (await prisma.partnership.create({
          data,
          ...args,
        })) as unknown as Prisma.PartnershipGetPayload<T>
    )
  },

  async getAllOrganisationIngress<T extends Prisma.PartnershipDefaultArgs>(organisationId: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.partnership.findMany({
          where: {
            toId: organisationId,
          },
          ...args,
        })) as unknown as Prisma.PartnershipGetPayload<T>[]
    )
  },

  async getAllOrganisationEgress<T extends Prisma.PartnershipDefaultArgs>(organisationId: string, args?: T) {
    return queryWrapper(
      async () =>
        (await prisma.partnership.findMany({
          where: {
            fromId: organisationId,
          },
          ...args,
        })) as unknown as Prisma.PartnershipGetPayload<T>[]
    )
  },
}
