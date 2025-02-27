import type { Realm } from '@prisma/client'
import { User, UserManager } from 'oidc-client-ts'

type Managers = Record<Realm, UserManager>

class Oidc {
  managers!: Managers

  constructor() {
    if (import.meta.client) {
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
    const config = useRuntimeConfig()
    const authority = config.public.OIDC.ENDPOINT
    const realms = config.public.OIDC.REALMS
    const appUrl = config.public.APPURL

    Object.entries(realms).forEach(([key, value]) => {
      this.managers[key as Realm] = this._createUserManager(authority, value.realm, value.client_id, appUrl)
    })
  }

  private _createUserManager(authority: string, realm: string, client_id: string, appUrl: string): UserManager {
    return new UserManager({
      authority: `${authority}/realms/${realm}`,
      client_id,
      redirect_uri: `${appUrl}/api/${realm}/auth/loginCallback`,
      post_logout_redirect_uri: `${appUrl}/api/${realm}/auth/logoutCallback`,
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
