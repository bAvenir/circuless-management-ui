import { nodeTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ body }) => {
      const data = body as nodeTypes.CreateBodyMaster
      return await db.node.queries.create(data, db.node.args.all)
    },
    {
      schemas: {
        body: nodeTypes.CreateBodyMasterSchema,
      },
      protected: true,
    }
  )
})
