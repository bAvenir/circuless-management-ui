export default defineEventHandler(async (event) => {
  return await apiWrapper(event, async () => {
    auth.logout(event, 'master')
    sendRedirect(event, '/')
  })
})
