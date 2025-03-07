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
