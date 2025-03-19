import { Prisma } from '@prisma/client'

export const OrganisationArgs = {
  all: {
    include: {
      users: {
        include: {
          organisation: true,
        }
      },
      ingressPartnerships: true,
      egressPartnerships: true,
    },
  } satisfies Prisma.OrganisationDefaultArgs,
  my: {
    include: {
      users: {
        include: {
          organisation: true,
        }
      },
      ingressPartnerships: {
        include: {
          from: true,
          to: true,
        },
      },
      egressPartnerships: {
        include: {
          from: true,
          to: true,
        }
      },
    },
  } satisfies Prisma.OrganisationDefaultArgs,
}
