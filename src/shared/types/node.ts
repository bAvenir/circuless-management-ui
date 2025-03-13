import { NodeAccess, NodeRole, Prisma, Realm } from '@prisma/client'
import Joi from 'joi'
import { clientRealms } from './misc'

export const nodeAccess = Object.values(NodeAccess)
export const nodeRole = Object.values(NodeRole)

export interface CreateBodyMaster {
  name: string
  host: string
  access: NodeAccess
  roles: NodeRole[]
  ownerId: string
  realm: Realm
}

export const CreateBodyMasterSchema = Joi.object({
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

export type GetMaster = Prisma.PromiseReturnType<typeof api.node.master.get>
export type GetAllMyRealm = Prisma.PromiseReturnType<typeof api.node.realm.getAllMy>
export type GetAllMaster = Prisma.PromiseReturnType<typeof api.node.master.getAll>

// Workaround for issue https://github.com/prisma/prisma/discussions/5522
export type WithStringDates = Omit<Prisma.NodeGetPayload<{}>, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}
