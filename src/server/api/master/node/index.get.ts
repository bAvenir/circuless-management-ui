defineRouteMeta({
  openAPI: {
    tags: ['Master Node'],
    description: 'Retrieve a list of all nodes with detailed information.',
  },
})

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      return await db.node.queries.getAll(db.node.args.all)
    },
    {
      protected: true,
    }
  )
})
