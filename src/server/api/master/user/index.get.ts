defineRouteMeta({
    openAPI: {
        tags: ['Master User'],
        description: 'Retrieve a list of all users with detailed information.',
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async () => {
            return await db.user.queries.getAll(db.user.args.all)
        },
        {
            protected: true,
        }
    )
})
