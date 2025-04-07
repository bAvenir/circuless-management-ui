import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => (user ? await db.user.queries.getRealm(user.id, params!.realm as Realm, db.user.args.my) : undefined),
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
      protected: true,
    }
  )
})
