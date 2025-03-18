import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(event, async ({ user }) => (user ? await db.user.queries.get(user.id, db.user.args.my) : undefined), {
    schemas: {
      params: miscTypes.AllRealmsParamSchema,
    },
    protected: true,
  })
})
