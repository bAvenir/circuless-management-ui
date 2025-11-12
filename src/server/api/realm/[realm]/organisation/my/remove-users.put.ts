import { Realm } from '@prisma/client'
import { miscTypes, organisationTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Organisation'],
        description:
            'Remove users from the organisation the user belongs to in the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
        ],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            userIds: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['userIds'],
                        additionalProperties: false,
                    },
                },
            },
        },
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ params, body, user }) => {
            if (!user?.organisationId) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }
            const data = body as organisationTypes.RemoveUserBodyRealm
            return await db.organisation.queries.removeUsersRealm(
                user.organisationId,
                params!.realm as Realm,
                data,
                db.organisation.args.my
            )
        },
        {
            schemas: {
                params: miscTypes.AllRealmsParamSchema,
                body: organisationTypes.RemoveUserBodyRealmSchema,
            },
            protected: true,
        }
    )
})
