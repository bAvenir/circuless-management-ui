import { ParthershipStatus } from '@prisma/client'
import { miscTypes, partnershipTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Partnership'],
        description:
            'Create partnership requests from the user organisation to other organisations in the specified realm.',
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
                            toIds: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                            },
                        },
                        required: ['toIds'],
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
            const data = body as partnershipTypes.CreateBody
            if (!user?.organisation) {
                throw new ApplicationError(
                    'User has no organisation',
                    HttpStatusCode.FORBIDDEN
                )
            }
            return await db.partnership.queries.create(
                data.toIds
                    .filter((id) => id !== user.organisation?.id)
                    .map((toId) => ({
                        fromId: user.organisation!.id,
                        toId,
                        status: ParthershipStatus.PENDING,
                    })),
                db.partnership.args.all
            )
        },
        {
            schemas: {
                body: partnershipTypes.CreateBodySchema,
                params: miscTypes.ClientRealmsParamSchema,
            },
            protected: true,
        }
    )
})
