import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.organisation.queries.get(params!.id, db.organisation.args.all)
    },
    {
      schemas: {
        params: miscTypes.IdParamSchema,
      },
      protected: true,
    }
  )
})
