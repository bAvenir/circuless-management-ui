import { Prisma } from '@prisma/client'

export const UserArgs = {
  all: {
    include: {
      organisation: true,
    },
  } satisfies Prisma.UserDefaultArgs,
  my: {
    include: {
      organisation: {
        include: {
          users: {
            include: {
              organisation: true,
            },
          },
        },
      },
    },
  } satisfies Prisma.UserDefaultArgs,
}
