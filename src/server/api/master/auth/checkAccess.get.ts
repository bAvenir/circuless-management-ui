import { Realm } from '@prisma/client'

defineRouteMeta({
    openAPI: {
        tags: ['Master Auth'],
        description: 'Check if the user has access (active session) to the Master realm.',
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async () => {
            try {
                await keycloak.checkAccess(event, Realm.master)
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
            protected: false,
        }
    )
})
