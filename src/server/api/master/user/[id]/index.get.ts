import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master User'],
        description:
            'Retrieve detailed information about a specific user by its ID.',
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
            return await db.user.queries.get(params!.id, db.user.args.all)
        },
        {
            schemas: {
                params: miscTypes.IdParamSchema,
            },
            protected: true,
        }
    )
})
