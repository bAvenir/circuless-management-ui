import { Realm } from '@prisma/client'
import Joi from 'joi'

export const allRelms = Object.values(Realm)
export const clientRelms = allRelms.filter((r) => r != 'master')

export type AllRealms = typeof allRelms[number]
export type ClientRealms = typeof clientRelms[number]

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
    .valid(...allRelms)
    .required(),
}).required()

export const ClientRealmsParamSchema = Joi.object({
  realm: Joi.string()
    .valid(...clientRelms)
    .required(),
}).required()
