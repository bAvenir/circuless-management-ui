export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      return await db.organisation.queries.getAll(db.organisation.args.all)
    },
    {
      protected: true,
    }
  )
})
