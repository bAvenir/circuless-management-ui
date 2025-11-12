defineRouteMeta({
    openAPI: {
        tags: ['Master Organisation'],
        description:
            'Retrieve a list of all organisations with detailed information.',
    },
})

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async () => {
            return await db.organisation.queries.getAll(
                db.organisation.args.all
            )
        },
        {
            protected: true,
        }
    )
})
