import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Organisation'],
        description: 'Delete an organisation by its ID.',
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
        async ({ params }) => {
            return await organisationManager.delete(event, params!.id)
        },
        {
            schemas: {
                params: miscTypes.IdParamSchema,
            },
            protected: true,
        }
    )
})
