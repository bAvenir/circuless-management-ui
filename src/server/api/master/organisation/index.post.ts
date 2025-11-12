import { organisationTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Master Organisation'],
        description: 'Create a new organisation in the master realm.',
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                            },
                            redirectUrl: {
                                type: 'string',
                            },
                            domain: {
                                type: 'string',
                            },
                            realm: {
                                type: 'string',
                                enum: ['circuless'],
                            },
                        },
                        required: ['name', 'redirectUrl', 'domain', 'realm'],
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
            const data = body as organisationTypes.CreateBodyMaster
            return await organisationManager.create(event, data)
        },
        {
            schemas: {
                body: organisationTypes.CreateBodyMasterSchema,
            },
            protected: true,
        }
    )
})
