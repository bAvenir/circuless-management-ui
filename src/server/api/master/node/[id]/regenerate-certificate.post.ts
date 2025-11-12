import { nodeManager } from '~/server/utils/nodeManager'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Node'],
        description:
            'Regenerate the certificate for a specific node by its ID.',
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

            return await nodeManager.regenerateCertificate(
                event,
                nodeId,
                userId
            )
        },
        {
            schemas: {
                params: miscTypes.IdParamSchema,
            },
            protected: true,
        }
    )
})
