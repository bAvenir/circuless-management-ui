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
export type GetMyRealm = Prisma.PromiseReturnType<typeof api.node.realm.getMy>
export type GetAllMaster = Prisma.PromiseReturnType<typeof api.node.master.getAll>

const withNoDates = Prisma.validator<Prisma.NodeDefaultArgs>()({
  omit: {
    createdAt: true,
    updatedAt: true,
  },
})

// Workaround for issue https://github.com/prisma/prisma/issues/25827
export type WithNoDates = Prisma.NodeGetPayload<typeof withNoDates>
