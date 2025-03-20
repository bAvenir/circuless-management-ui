import { Prisma, Realm } from '@prisma/client'
import Joi from 'joi'
import { clientRealms } from './misc'

export interface CreateBodyMaster {
  name: string
  redirectUrl: string
  domain: string
  realm: Realm
}

export interface UpdateBodyRealm {
  name?: string
}

export interface UpdateBodyMaster extends UpdateBodyRealm {}

export const CreateBodyMasterSchema = Joi.object({
  name: Joi.string().required(),
  redirectUrl: Joi.string().required(),
  domain: Joi.string().required(),
  realm: Joi.string()
    .valid(...clientRealms)
    .required(),
}).required()

export const UpdateBodyRealmSchema = Joi.object({
  name: Joi.string().optional(),
}).required()

export type GetMaster = Prisma.PromiseReturnType<typeof api.organisation.master.get>
export type GetMyRealm = Prisma.PromiseReturnType<typeof api.organisation.realm.getMy>
export type GetAllMaster = Prisma.PromiseReturnType<typeof api.organisation.master.getAll>
export type GetAllRealm = Prisma.PromiseReturnType<typeof api.organisation.realm.getAll>
export type GetRealm = Prisma.PromiseReturnType<typeof api.organisation.realm.get>
export type Sync = Prisma.PromiseReturnType<typeof api.organisation.master.sync>
