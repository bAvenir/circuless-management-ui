const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(event, async () => {
    keycloak.logout(event, 'master')
    sendRedirect(event, `${config.public.APP_URL}/`)
  })
})
