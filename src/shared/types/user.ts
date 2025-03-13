import { Prisma, Realm } from '@prisma/client'
import Joi from 'joi'
import { clientRealms } from './misc'

export interface InviteBody {
  email: string
  realm: Realm
  givenName?: string
  familyName?: string
  kcOrganisationId: string
}

export const InviteBodySchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  realm: Joi.string().valid(...clientRealms).required(),
  givenName: Joi.string().optional(),
  familyName: Joi.string().optional(),
  kcOrganisationId: Joi.string().required(),
}).required()

export type GetMy = Prisma.PromiseReturnType<typeof api.user.realm.getMy>
export type GetMaster = Prisma.PromiseReturnType<typeof api.user.master.get>
export type GetRealm = Prisma.PromiseReturnType<typeof api.user.realm.get>
export type GetAllMaster = Prisma.PromiseReturnType<typeof api.user.master.getAll>
export type GetAllRealm = Prisma.PromiseReturnType<typeof api.user.realm.getAll>
export type InviteMaster = Prisma.PromiseReturnType<typeof api.user.master.invite>
export type InviteCirculess = Prisma.PromiseReturnType<typeof api.user.circuless.invite>
export type Sync = Prisma.PromiseReturnType<typeof api.user.master.sync>
