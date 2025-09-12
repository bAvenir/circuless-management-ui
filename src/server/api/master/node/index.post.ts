import { nodeTypes } from '~/shared/types'
import { nodeManager } from '~/server/utils/nodeManager'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ body }) => {
      const data = body as nodeTypes.CreateBody
      return await nodeManager.create(event, data)
    },
    {
      schemas: {
        body: nodeTypes.CreateBodySchema,
      },
      protected: true,
    }
  )
})
