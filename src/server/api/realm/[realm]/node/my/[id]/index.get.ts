import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Node'],
        description:
            'Get a specific node by ID that the user has access to in the specified realm.',
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
        async ({ user, params }) => {
            return await db.node.queries.getUserRealm(
                params!.id,
                user!.id,
                params!.realm as Realm,
                db.node.args.all
            )
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.ClientRealmsParamSchema.concat(
                    miscTypes.IdParamSchema
                ),
            },
        }
    )
})
