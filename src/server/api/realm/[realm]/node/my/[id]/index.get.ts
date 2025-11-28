import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Node'],
        description:
            'Get single node of the user has access to in the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
            {
                in: 'path',
                name: 'id',
                schema: { type: 'string' },
            },
        ],
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ user, params }) => {
         const id = params!.id
            return await db.node.queries.getUserRealm(
               id,
                user!.id,
                params!.realm as Realm,
                db.node.args.all
            )
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.IdParamSchema.concat(miscTypes.ClientRealmsParamSchema),
            },
        }
    )
})
