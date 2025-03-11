import { Prisma, Realm } from '@prisma/client'
import Joi from 'joi'
import { clientRealms } from './misc'

export interface CreateBodyMaster {
  name: string
  redirectUrl: string
  domain: string
  realm: Realm
}

export const CreateBodyMasterSchema = Joi.object({
  name: Joi.string().required(),
  redirectUrl: Joi.string().required(),
  domain: Joi.string().required(),
  realm: Joi.string().valid(...clientRealms).required(),
}).required()

export type GetMaster = Prisma.PromiseReturnType<typeof api.organisation.master.get>
export type GetMyRealm = Prisma.PromiseReturnType<typeof api.organisation.realm.getMy>
export type GetAllMaster = Prisma.PromiseReturnType<typeof api.organisation.master.getAll>
export type Sync = Prisma.PromiseReturnType<typeof api.organisation.master.sync>

const withNoDates = Prisma.validator<Prisma.OrganisationDefaultArgs>()({
  omit: {
    createdAt: true,
    updatedAt: true,
  },
  include: {
    users: {
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        organisation: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      }
    }
  }
})

// Workaround for issue https://github.com/prisma/prisma/issues/25827
export type WithNoDates = Prisma.OrganisationGetPayload<typeof withNoDates>
