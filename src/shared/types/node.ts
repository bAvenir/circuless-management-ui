import { NodeAccess, NodeRole, Prisma, Realm } from '@prisma/client'
import Joi from 'joi'
import { clientRealms } from './misc'

export const nodeAccess = Object.values(NodeAccess)
export const nodeRole = Object.values(NodeRole)

export interface CreateBody {
  name: string
  host: string
  access: NodeAccess
  roles: NodeRole[]
  ownerId: string
  realm: Realm
}

export interface CreateBodyRealm {
  name: string
  host: string
}

export const CreateBodySchema = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  access: Joi.string()
    .valid(...nodeAccess)
    .required(),
  roles: Joi.array()
    .items(
      Joi.string()
        .valid(...nodeRole)
        .required()
    )
    .required(),
  ownerId: Joi.string().required(),
  realm: Joi.string()
    .valid(...clientRealms)
    .required(),
}).required()

export const CreateBodyRealmSchema = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
}).required()

export type GetMaster = Prisma.PromiseReturnType<typeof api.node.master.get>
export type GetMyRealm = Prisma.PromiseReturnType<typeof api.node.realm.getMy>
export type GetAllMaster = Prisma.PromiseReturnType<typeof api.node.master.getAll>
export type GetAllMyRealm = Prisma.PromiseReturnType<typeof api.node.realm.getAllMy>

// Workaround for issue https://github.com/prisma/prisma/discussions/5522
export type WithStringDates = Omit<Prisma.NodeGetPayload<{}>, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
