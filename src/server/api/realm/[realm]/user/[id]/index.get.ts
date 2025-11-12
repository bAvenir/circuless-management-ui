import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm User'],
        description: 'Get a specific user by ID in the specified realm.',
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
            return await db.user.queries.getRealm(
                params!.id,
                params!.realm as Realm,
                db.user.args.all
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
