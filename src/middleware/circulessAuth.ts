import { FetchError } from 'ofetch'

const realm = 'circuless'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const $oidc = nuxtApp.$oidc

  const access = await api.auth.realm.checkAccess(realm)

  if (!access) {
    if (import.meta.client) await $oidc.login(realm)
    return abortNavigation(`No access to ${realm} realm`)
  }
})
