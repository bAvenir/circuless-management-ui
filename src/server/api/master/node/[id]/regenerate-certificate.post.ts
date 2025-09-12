import { nodeManager } from '~/server/utils/nodeManager'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, user }) => {
      const nodeId = params!.id as string
      const userId = user!.id
      
      return await nodeManager.regenerateCertificate(event, nodeId, user!.id)
    },
    {
      protected: true,
    }
  )
})
