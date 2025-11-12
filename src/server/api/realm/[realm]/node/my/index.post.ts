import { NodeAccess, NodeRole } from '@prisma/client'
import { miscTypes, nodeTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Node'],
        description: 'Create a new node in the specified realm.',
        parameters: [
            {
                in: 'path',
                name: 'realm',
                schema: { type: 'string', enum: ['circuless'] },
            },
        ],
        requestBody: {
            description: 'Node creation data.',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                            host: {
                                type: 'string',
                            },
                        },
                        required: ['name', 'host'],
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
        async ({ body, user }) => {
            if (!user?.organisationId) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }

            const data = body as nodeTypes.CreateBodyRealm
            const ownerId = user!.organisationId
            const realm = user!.realm
            const access = NodeAccess.direct
            const roles = [NodeRole.discovery, NodeRole.registry]
            return await nodeManager.create(event, {
                ...data,
                ownerId,
                realm,
                access,
                roles,
            })
        },
        {
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
                body: nodeTypes.CreateBodyRealmSchema,
            },
            protected: true,
        }
    )
})
