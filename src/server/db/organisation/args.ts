import { Prisma } from '@prisma/client'

export const OrganisationArgs = {
  all: {
    include: {
      users: true,
    }
  } satisfies Prisma.OrganisationDefaultArgs,
}
