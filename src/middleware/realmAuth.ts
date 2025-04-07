import type { Realm } from '@prisma/client'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  const $oidc = nuxtApp.$oidc
  const realm = to.params.realm as Realm | undefined

  if (!realm) {
    throw new Error('Realm not found')
  }

  const access = await api.auth.realm.checkAccess(realm)

  if (!access) {
    if (import.meta.client) await $oidc.login(realm)
    return abortNavigation(`No access to ${realm} realm`)
  }
})
