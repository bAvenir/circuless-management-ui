import { NodeAccess, NodeRestrictions, Prisma, Realm } from '@prisma/client'
import Joi from 'joi'
import { clientRelms } from './misc'

export const nodeAccess = Object.values(NodeAccess)
export const nodeRestrictions = Object.values(NodeRestrictions)

export interface CreateBodyMaster {
  name: string
  host: string
  access: NodeAccess
  restrictions: NodeRestrictions[]
  ownerId: string
  realm: Realm
}

export const CreateBodyMasterSchema = Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  access: Joi.string()
    .valid(...nodeAccess)
    .required(),
  restrictions: Joi.array()
    .items(
      Joi.string()
        .valid(...nodeRestrictions)
        .required()
    )
    .required(),
  ownerId: Joi.string().required(),
  realm: Joi.string()
    .valid(...clientRelms)
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
