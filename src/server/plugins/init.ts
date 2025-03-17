export default defineNitroPlugin(async () => {
  await keycloak.init()
  console.info('🚀 Server initialized!')
})
