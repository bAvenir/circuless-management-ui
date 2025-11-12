defineRouteMeta({
    openAPI: {
        tags: ['Master Organisation'],
        description: 'Synchronize organisations with Keycloak.',
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async () => {
            return await organisationManager.syncWithKc(event)
        },
        {
            protected: true,
        }
    )
})
