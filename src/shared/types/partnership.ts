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

export type GetMy = Prisma.PromiseReturnType<typeof api.partnership.realm.getMy>
