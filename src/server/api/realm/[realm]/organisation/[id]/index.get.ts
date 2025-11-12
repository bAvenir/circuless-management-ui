import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Organisation'],
        description:
            'Get a specific organisation by ID in the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
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
            return await db.organisation.queries.getRealm(
                params!.id,
                params!.realm as Realm,
                db.organisation.args.all
            )
        },
        {
            schemas: {
                params: miscTypes.AllRealmsParamSchema.concat(
                    miscTypes.IdParamSchema
                ),
            },
            protected: true,
        }
    )
})
