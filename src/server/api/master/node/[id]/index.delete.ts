import { nodeManager } from '~/server/utils/nodeManager'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Node'],
        description: 'Delete a node by its ID.',
        parameters: [
            {
                in: 'path',
                name: 'id',
                schema: { type: 'string', format: 'uuid' },
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ params, user }) => {
            const nodeId = params!.id as string
            const userId = user!.id
            return await nodeManager.delete(event, nodeId, userId)
        },
        {
            schemas: {
                params: miscTypes.IdParamSchema,
            },
            protected: true,
        }
    )
})
