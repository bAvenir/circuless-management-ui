export default defineNitroPlugin(async () => {
  await auth.init()
  console.info('🚀 Server initialized!')
})
