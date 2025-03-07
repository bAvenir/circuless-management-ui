import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await db.node.queries.get(params!.id, db.node.args.all)
    },
    {
      schemas: {
        params: miscTypes.IdParamSchema,
      },
      protected: true,
    }
  )
})
