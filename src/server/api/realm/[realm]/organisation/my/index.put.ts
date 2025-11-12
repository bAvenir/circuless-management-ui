import { miscTypes, organisationTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Organisation'],
        description:
            'Update the organisation the user belongs to in the specified realm.',
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
                            name: {
                                type: 'string',
                            },
                        },
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
        async ({ user, body }) => {
            if (!user?.organisationId) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }
            const data = body as organisationTypes.UpdateBodyRealm
            return await organisationManager.update(
                event,
                user.organisationId,
                data,
                db.organisation.args.my
            )
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
                body: organisationTypes.UpdateBodyRealmSchema,
            },
        }
    )
})
