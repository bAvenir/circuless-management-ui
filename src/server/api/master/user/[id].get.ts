import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.user.queries.get(params!.id, db.user.args.all)
    },
    {
      schemas: {
        params: miscTypes.IdParamSchema,
      },
      protected: true,
    }
  )
})
