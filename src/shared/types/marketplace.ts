import { Prisma } from '@prisma/client'

export type GetAllCirculess = Prisma.PromiseReturnType<typeof api.marketplace.circuless.getAll>
export type GetOneCirculess = Prisma.PromiseReturnType<typeof api.marketplace.circuless.get>
