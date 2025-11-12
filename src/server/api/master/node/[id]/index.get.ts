import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Node'],
        description:
            'Retrieve detailed information about a specific node by its ID.',
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
