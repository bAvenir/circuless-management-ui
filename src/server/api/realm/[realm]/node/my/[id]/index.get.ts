import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => {
      return await db.node.queries.getUserRealm(params!.id, user!.id, params!.realm as Realm, db.node.args.all)
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.ClientRealmsParamSchema.concat(miscTypes.IdParamSchema),
      },
    }
  )
})
