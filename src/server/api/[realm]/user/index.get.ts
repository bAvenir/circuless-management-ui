import { miscTypes } from '~/shared/types'
import type { Realm } from '@prisma/client'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.user.queries.getAllRealm(params!.realm as Realm, db.user.args.all)
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
    }
  )
})
