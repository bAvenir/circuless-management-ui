import Joi from 'joi'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.user.queries.getRealm(params!.id, params!.realm as miscTypes.ClientRealms, db.user.args.all)
    },
    {
      schemas: {
        params: Joi.object({ ...miscTypes.IdParamSchema, ...miscTypes.ClientRealmsParamSchema }),
      },
      protected: true,
    }
  )
})
