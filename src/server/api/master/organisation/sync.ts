export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      return await organisationManager.syncAllOrganisationsWithKc(event)
    },
    {
      protected: true,
    }
  )
})
