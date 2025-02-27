import { FetchError } from 'ofetch'
import { useMasterUserStore } from '~/stores/master/user'

const realm = 'master'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const masterUserStore = useMasterUserStore()
  const $oidc = nuxtApp.$oidc
  try {
    if (import.meta.server) return
    await api.auth.checkAccess(realm)
  } catch (error) {
    if (error instanceof FetchError && error.response?.status === 401) {
      masterUserStore.$reset()
      await $oidc.login(realm)
      abortNavigation()
    } else {
      console.error(error)
      throw error
    }
  }
})
