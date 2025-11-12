defineRouteMeta({
    openAPI: {
        tags: ['Master User'],
        description: 'Synchronize users with Keycloak.',
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async () => {
            return await userManager.syncWithKc(event)
        },
        {
            protected: true,
        }
    )
})
