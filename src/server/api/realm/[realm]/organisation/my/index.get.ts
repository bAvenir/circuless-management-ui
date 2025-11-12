import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Organisation'],
        description:
            'Get the organisation the user belongs to in the specified realm.',
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
        async ({ user, params }) => {
            if (!user?.organisationId) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }
            return await db.organisation.queries.getRealm(
                user.organisationId,
                params!.realm as Realm,
                db.organisation.args.my
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
