import { userTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master User'],
        description: 'Invite a new user by sending an invitation email.',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                format: 'email',
                            },
                            realm: {
                                type: 'string',
                                enum: ['circuless'],
                            },
                            givenName: {
                                type: 'string',
                            },
                            familyName: {
                                type: 'string',
                            },
                            kcOrganisationId: {
                                type: 'string',
                            },
                        },
                        required: ['email', 'realm', 'kcOrganisationId'],
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
        async ({ body }) => {
            const data = body as userTypes.InviteBodyMaster
            await userManager.invite(event, data)
            return 'User invitation sent'
        },
        {
            schemas: {
                body: userTypes.InviteBodyMasterSchema,
            },
            protected: true,
        }
    )
})
