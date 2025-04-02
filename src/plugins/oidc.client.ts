import type { Realm } from '@prisma/client'
import type { RuntimeConfig } from 'nuxt/schema'
import { UserManager } from 'oidc-client-ts'

type Managers = Record<Realm, UserManager>

class Oidc {
  config!: RuntimeConfig
  managers!: Managers

  constructor() {
    if (import.meta.client) {
      this.config = useRuntimeConfig()
      this.managers = {} as Managers
      this._initManagers()
    }
  }

  async login(realm: Realm) {
    await this.managers[realm].signinRedirect()
  }

  async logout(realm: Realm, to?: string) {
    await this.managers[realm].signoutRedirect()
  }

  private _initManagers() {
    const realms = this.config.public.OIDC.REALMS

    Object.entries(realms).forEach(([key, value]) => {
      this.managers[key as Realm] = this._createUserManager(value.realm, value.client_id)
    })
  }

  private _createUserManager(realm: string, client_id: string): UserManager {
    const authority = this.config.public.OIDC.ENDPOINT
    const appUrl = this.config.public.APP_URL
    return new UserManager({
      authority: `${authority}/realms/${realm}`,
      client_id,
      redirect_uri: `${appUrl}/api/realm/${realm}/auth/loginCallback`,
      post_logout_redirect_uri: `${appUrl}/api/realm/${realm}/auth/logoutCallback`,
      response_type: 'code',
      response_mode: 'query',
      scope: 'openid profile email organization',
      disablePKCE: true,
    })
  }
}

export default defineNuxtPlugin(() => {
  const oidc = new Oidc()
  return { provide: { oidc } }
})
