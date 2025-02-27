import { Prisma } from '@prisma/client'

export const UserArgs = {
  all: {
    include: {
      organisation: true,
    },
  } satisfies Prisma.UserDefaultArgs,
}
