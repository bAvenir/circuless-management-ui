export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      return await userManager.syncAllUsersWithKc(event)
    },
    {
      protected: true,
    }
  )
})
