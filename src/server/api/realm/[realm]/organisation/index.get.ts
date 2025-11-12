import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Organisation'],
        description: 'Get all organisations in the specified realm.',
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
            return await db.organisation.queries.getAllRealm(
                params!.realm as Realm,
                db.organisation.args.all
            )
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
            },
        }
    )
})
