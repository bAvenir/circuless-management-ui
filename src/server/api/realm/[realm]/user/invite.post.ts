import { miscTypes, userTypes } from '~/shared/types'
import type { Realm } from '@prisma/client'

defineRouteMeta({
    openAPI: {
        tags: ['Realm User'],
        description:
            'Invite a new user to the organisation in the specified realm.',
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
                            email: {
                                type: 'string',
                                format: 'email',
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
                        required: ['email', 'kcOrganisationId'],
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
        async ({ user, body, params }) => {
            const data = body as userTypes.InviteBodyRealm
            const realm = params!.realm as Realm
            if (!user?.organisation) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }
            if (user.organisation.realm !== realm) {
                throw new ApplicationError(
                    'User does not belong to this realm',
                    HttpStatusCode.FORBIDDEN
                )
            }
            await userManager.invite(event, { ...data, realm })
            return 'User invitation sent'
        },
        {
            schemas: {
                body: userTypes.InviteBodyRealmSchema,
                params: miscTypes.ClientRealmsParamSchema,
            },
            protected: true,
        }
    )
})
