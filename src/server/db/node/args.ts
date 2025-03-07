import { Prisma } from '@prisma/client'

export const NodeArgs = {
  all: {
    include: {
      owner: true,
      wireguard: true,
    }
  } satisfies Prisma.NodeDefaultArgs,
}
