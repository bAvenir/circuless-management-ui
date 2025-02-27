export default defineEventHandler(async (event) => {
  return await apiWrapper(event, async () => {
    await auth.checkAccess(event, 'master')
    return true
  })
})
