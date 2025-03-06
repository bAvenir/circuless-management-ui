import { FetchError } from 'ofetch'

const realm = 'master'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const $oidc = nuxtApp.$oidc

  try {
    if (import.meta.server) return
    await api.auth.realm.checkAccess(realm)
  } catch (error) {
    if (error instanceof FetchError && error.response?.status === 401) {
      await $oidc.login(realm)
      abortNavigation()
    } else {
      console.error(error)
      throw error
    }
  }
})
