const realm = 'master'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const $oidc = nuxtApp.$oidc

  const access = await api.auth.master.checkAccess()

  if (!access) {
    if (import.meta.client) await $oidc.login(realm)
    return abortNavigation(`No access to ${realm} realm`)
  }
})
