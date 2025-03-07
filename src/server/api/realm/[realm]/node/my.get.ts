import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => {
      return await db.node.queries.getUserRealm(user!.id, params!.realm as miscTypes.ClientRealms, db.node.args.all)
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
    }
  )
})
