import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.organisation.queries.getRealm(params!.id, params!.realm as Realm, db.organisation.args.all)
    },
    {
      schemas: {
        params: miscTypes.AllRealmsParamSchema.concat(miscTypes.IdParamSchema),
      },
      protected: true,
    }
  )
})
