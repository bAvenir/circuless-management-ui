import { miscTypes } from '~/shared/types'
import type { Realm } from '@prisma/client'

defineRouteMeta({
    openAPI: {
        tags: ['Realm User'],
        description: 'Get all users in the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ params }) => {
            return await db.user.queries.getAllRealm(
                params!.realm as Realm,
                db.user.args.all
            )
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.AllRealmsParamSchema,
            },
        }
    )
})
