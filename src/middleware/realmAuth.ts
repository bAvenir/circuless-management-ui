import type { Realm } from '@prisma/client'
import { FetchError } from 'ofetch'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const $oidc = nuxtApp.$oidc
  const realm = to.params.realm as Realm | undefined

  if (!realm) {
    throw new Error('Realm not found')
  }

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
