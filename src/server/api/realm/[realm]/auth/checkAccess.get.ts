import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

defineRouteMeta({
    openAPI: {
        tags: ['Realm Auth'],
        description:
            'Check if the user has access (active session) to the specified realm.',
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
        async ({ params }) => {
            const realm = params!.realm as Realm
            try {
                await keycloak.checkAccess(event, realm)
            } catch (error) {
                if (
                    error instanceof CustomError &&
                    error.statusCode === HttpStatusCode.UNAUTHORIZED
                ) {
                    return false
                }
                throw error
            }
            return true
        },
        {
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
            },
            protected: false,
        }
    )
})
