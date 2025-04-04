import { ParthershipStatus, Prisma } from '@prisma/client'
import Joi from 'joi'

export interface CreateBody {
  toIds: string[]
}

export interface CreateData {
  toId: string
  fromId: string
  status: ParthershipStatus
}

export const CreateBodySchema = Joi.object({
  toIds: Joi.array().items(Joi.string()).required(),
}).required()

export type GetAllMy = Prisma.PromiseReturnType<typeof api.partnership.realm.useGetAllMy>
export type GetMyIngress = Prisma.PromiseReturnType<typeof api.partnership.realm.useGetMyIngress>
export type GetMyEgress = Prisma.PromiseReturnType<typeof api.partnership.realm.useGetMyEgress>
