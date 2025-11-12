import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Organisation'],
        description:
            'Retrieve detailed information about a specific organisation by its ID.',
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
            return await db.organisation.queries.get(
                params!.id,
                db.organisation.args.all
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
