import { Realm } from '@prisma/client'
import Joi from 'joi'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.organisation.queries.getRealm(params!.id, params!.realm as Realm, db.organisation.args.all)
    },
    {
      schemas: {
        params: Joi.object({ ...miscTypes.IdParamSchema, ...miscTypes.AllRealmsParamSchema }),
      },
      protected: true,
    }
  )
})
