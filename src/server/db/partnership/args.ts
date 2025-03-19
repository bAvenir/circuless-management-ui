import { Prisma } from '@prisma/client'

export const PartnershipArgs = {
  all: {
    include: {
      from: true,
      to: true,
    },
  } satisfies Prisma.PartnershipDefaultArgs,
}
