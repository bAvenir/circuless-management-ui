import { Prisma } from '@prisma/client'

export const OrganisationArgs = {
  all: {
    include: {
      users: {
        include: {
          organisation: true,
        }
      },
    },
  } satisfies Prisma.OrganisationDefaultArgs,
}
