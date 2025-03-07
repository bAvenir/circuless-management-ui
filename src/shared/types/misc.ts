
import { Realm } from '@prisma/client'
import Joi from 'joi'

export const allRealms = Object.values(Realm)
export const clientRealms = allRealms.filter((r) => r != 'master')
export interface IdParam {
  id: string
}

export interface RealmParam {
  realm: Realm
}

export const IdParamSchema = Joi.object({
  id: Joi.string().required(),
}).required()

export const AllRealmsParamSchema = Joi.object({
  realm: Joi.string()
    .valid(...allRealms)
    .required(),
}).required()

export const ClientRealmsParamSchema = Joi.object({
  realm: Joi.string()
    .valid(...clientRealms)
    .required(),
}).required()
