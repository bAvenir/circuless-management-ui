import { nodeTypes } from '~/shared/types'
import { nodeManager } from '~/server/utils/nodeManager'

// Schema generated from nodeTypes.CreateBodySchema - copy from src/server/schemas/generated.txt
defineRouteMeta({
  openAPI: {
    tags: ['Master Node'],
    description: 'Create a new node in the system.',
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
              host: {
                type: 'string',
              },
              access: {
                type: 'string',
                enum: ['direct', 'wireguard'],
              },
              roles: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['discovery', 'registry'],
                },
              },
              ownerId: {
                type: 'string',
              },
              realm: {
                type: 'string',
                enum: ['circuless'],
              },
            },
            required: ['name', 'host', 'access', 'roles', 'ownerId', 'realm'],
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
      const data = body as nodeTypes.CreateBody
      return await nodeManager.create(event, data)
    },
    {
      schemas: {
        body: nodeTypes.CreateBodySchema,
      },
      protected: true,
    }
  )
})
