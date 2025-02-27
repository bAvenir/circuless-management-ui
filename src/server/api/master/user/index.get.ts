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
