import { Realm } from '@prisma/client'
import type { EventHandlerRequest, H3Event } from 'h3'
import { FetchError } from 'ofetch'
import { jwtVerify } from 'jose/jwt/verify'
import { JWSSignatureVerificationFailed } from 'jose/errors'
import type { ClaimsUnverified, ClaimsVerified } from '../types/jwt'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  refresh_expires_in: number
}

export interface OrganisationRepresentation {
  id?: string
  name: string
  alias: string
  redirectUrl: string
  domains: OrganizationDomainRepresentation[]
}

export interface OrganizationDomainRepresentation {
  name: string
  verified: boolean
}

export interface InviteRepresentation {
  email: string
  firstName?: string
  lastName?: string
}

export interface MemberRepresentation {
  id?: string
  username: string
  email: string
  firstName?: string
  lastName?: string
}

const config = useRuntimeConfig()

class Auth {
  private publicKeys: Record<Realm, undefined> = Object.keys(config.public.OIDC.REALMS).reduce((acc, realm) => {
    acc[realm as Realm] = undefined
    return acc
  }, {} as Record<Realm, undefined>)

  async init() {
    for (const realm of Object.keys(this.publicKeys) as Realm[]) {
      this.publicKeys[realm] = await this.getPublicKey(realm)
    }
    console.info('🔑 Public keys loaded')
  }

  async getPublicKey(realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT
    const jwksUrl = `${endpoint}/realms/${realm}/protocol/openid-connect/certs`
    const { keys } = await keycloakApiWrapper(async () => {
      return await $fetch<{ keys: any[] }>(jwksUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
    return keys.find((key) => key.use === 'sig') // Find the public key used for signature verification
  }

  async login(event: H3Event<EventHandlerRequest>, code: string, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT
    const { client_id } = config.public.OIDC.REALMS[realm]
    const client_secret = config.OIDC.REALM_SECRETS[realm]
    const appUrl = config.public.APPURL

    const tokens = await keycloakApiWrapper(async () => {
      const url = `${endpoint}/realms/${realm}/protocol/openid-connect/token`
      const data = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        redirect_uri: `${appUrl}/api/realm/${realm}/auth/loginCallback`,
        code,
      })

      return await $fetch<TokenResponse>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
    })

    const accessExpires = new Date(Date.now() + tokens.expires_in * 1000)
    const refreshExpires = new Date(Date.now() + tokens.refresh_expires_in * 1000)

    setCookie(event, `${realm}_access_token`, tokens.access_token, {
      expires: accessExpires,
      httpOnly: true,
      secure: true,
    })

    setCookie(event, `${realm}_refresh_token`, tokens.refresh_token, {
      expires: refreshExpires,
      httpOnly: true,
      secure: true,
      maxAge: tokens.refresh_expires_in,
    })

    return tokens
  }

  logout(event: H3Event<EventHandlerRequest>, realm: Realm) {
    deleteCookie(event, `${realm}_access_token`)
    deleteCookie(event, `${realm}_refresh_token`)
  }

  async verifyToken(token: string, realm: Realm) {
    const publicKey = this.publicKeys[realm]
    if (!publicKey) {
      throw new ApplicationError('Public key not found', HttpStatusCode.INTERNAL_SERVER_ERROR)
    }

    try {
      const { payload } = await jwtVerify(token, publicKey)
      return payload as ClaimsUnverified
    } catch (error) {
      if (error instanceof JWSSignatureVerificationFailed) {
        throw new ApplicationError(error.message, HttpStatusCode.UNAUTHORIZED, error.cause)
      }
      throw error
    }
  }

  validateClaims(event: H3Event<EventHandlerRequest>) {
    const claims = event.context.claims
    if (!claims || !claims.sub || !claims.email) {
      throw new ApplicationError('Invalid claims', HttpStatusCode.UNAUTHORIZED)
    }
    if (claims.organization) {
      const organisationKey = getFirstKey(claims.organization)
      return {
        ...claims,
        kcOrganisation: claims.organization[organisationKey],
      } as ClaimsVerified
    } else {
      return {
        ...claims,
        kcOrganisation: undefined,
      } as ClaimsVerified
    }
  }

  async refreshTokens(event: H3Event<EventHandlerRequest>, refresh_token: string, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT
    const { client_id } = config.public.OIDC.REALMS[realm]
    const client_secret = config.OIDC.REALM_SECRETS[realm]

    const tokens = await keycloakApiWrapper(async () => {
      const url = `${endpoint}/realms/${realm}/protocol/openid-connect/token`
      const data = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        refresh_token,
      })

      return await $fetch<TokenResponse>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
    })

    const accessExpires = new Date(Date.now() + tokens.expires_in * 1000)
    const refreshExpires = new Date(Date.now() + tokens.refresh_expires_in * 1000)

    setCookie(event, `${realm}_access_token`, tokens.access_token, {
      expires: accessExpires,
      httpOnly: true,
      secure: true,
    })

    setCookie(event, `${realm}_refresh_token`, tokens.refresh_token, {
      expires: refreshExpires,
      httpOnly: true,
      secure: true,
      maxAge: tokens.refresh_expires_in,
    })

    return tokens
  }

  async checkAccess(event: H3Event<EventHandlerRequest>, realm: Realm) {
    const cookies = parseCookies(event)
    const access_token = cookies[`${realm}_access_token`] as string | undefined
    const refresh_token = cookies[`${realm}_refresh_token`] as string | undefined
    if (!refresh_token) {
      throw new ApplicationError('Unauthorized', HttpStatusCode.UNAUTHORIZED)
    }
    let tokens = null
    if (!access_token) {
      try {
        tokens = await this.refreshTokens(event, refresh_token, realm)
      } catch (error) {
        console.error('error', error)
        this.logout(event, realm)
        throw new ApplicationError('Unauthorized', HttpStatusCode.UNAUTHORIZED)
      }
    } else {
      tokens = { access_token, refresh_token }
    }
    event.context.claims = await this.verifyToken(tokens.access_token, realm)
    event.context.tokens = tokens
  }

  async createOrganisation(event: H3Event<EventHandlerRequest>, organisation: OrganisationRepresentation, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    if (realm === 'master') {
      throw new ApplicationError('Cannot create an organisation in master realm', HttpStatusCode.BAD_REQUEST)
    }

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations`
      const access_token = event.context.tokens?.access_token

      await $fetch<void>(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...organisation,
          enabled: true,
        }),
      })

      const response = await $fetch<OrganisationRepresentation[]>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        params: {
          search: organisation.name,
          exact: true,
          max: 1,
        },
      })

      if (response.length === 0) {
        throw new ApplicationError('Organisation not created', HttpStatusCode.INTERNAL_SERVER_ERROR)
      }

      return response[0]
    })
  }

  async getOrganisationById(event: H3Event<EventHandlerRequest>, id: string, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations/${id}`
      const access_token = event.context.tokens?.access_token

      return await $fetch<OrganisationRepresentation>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    })
  }

  async getOrganisationByName(event: H3Event<EventHandlerRequest>, name: string, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations`
      const access_token = event.context.tokens?.access_token

      const response = await $fetch<OrganisationRepresentation[]>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          search: name,
          exact: true,
          max: 1,
        },
      })

      if (response.length === 0) {
        throw new ApplicationError('Organisation not found', HttpStatusCode.NOT_FOUND)
      }

      return response[0]
    })
  }

  async deleteOrganisation(event: H3Event<EventHandlerRequest>, id: string, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    if (realm === 'master') {
      throw new ApplicationError('Cannot delete an organisation in master realm', HttpStatusCode.BAD_REQUEST)
    }

    await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations/${id}`
      const access_token = event.context.tokens?.access_token

      await $fetch<void>(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    })
  }

  async inviteUser(event: H3Event<EventHandlerRequest>, invite: InviteRepresentation, kcOrganisationId: string, realm: Realm, accessToken?: string) {
    const endpoint = config.OIDC.ENDPOINT

    if (realm === 'master') {
      throw new ApplicationError('Cannot register user in master realm', HttpStatusCode.BAD_REQUEST)
    }

    await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations/${kcOrganisationId}/members/invite-user`
      const access_token = accessToken ?? event.context.tokens?.access_token

      const data = new URLSearchParams({
        email: invite.email,
        firstName: invite.firstName || '',
        lastName: invite.lastName || '',
      })

      await $fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
    })
  }

  async deleteUser(event: H3Event<EventHandlerRequest>, id: string, realm: Realm): Promise<void> {
    const endpoint = config.OIDC.ENDPOINT

    if (realm === 'master') {
      throw new ApplicationError('Cannot register user in master realm', HttpStatusCode.BAD_REQUEST)
    }

    await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/users/${id}`
      const access_token = event.context.tokens?.access_token

      await $fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    })
  }

  async getUsers(event: H3Event<EventHandlerRequest>, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/users`
      const access_token = event.context.tokens?.access_token

      return await $fetch<MemberRepresentation[]>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    })
  }

  async getOrganisations(event: H3Event<EventHandlerRequest>, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations`
      const access_token = event.context.tokens?.access_token

      return await $fetch<OrganisationRepresentation[]>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    })
  }

  async getOrganisationMembers(event: H3Event<EventHandlerRequest>, id: string, realm: Realm) {
    const endpoint = config.OIDC.ENDPOINT

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/admin/realms/${realm}/organizations/${id}/members`
      const access_token = event.context.tokens?.access_token

      return await $fetch<MemberRepresentation[]>(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    })
  }

  async getMasterToken(event: H3Event<EventHandlerRequest>) {
    const endpoint = config.OIDC.ENDPOINT
    const { client_id } = config.public.OIDC.REALMS.master
    const client_secret = config.OIDC.REALM_SECRETS.master

    return await keycloakApiWrapper(async () => {
      const url = `${endpoint}/realms/master/protocol/openid-connect/token`
      const data = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id,
        client_secret,
      })

      return await $fetch<TokenResponse>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      })
    })
  }
}

// Wrapper function to handle Keycloak API requests and errors
async function keycloakApiWrapper<T>(keycloakRequest: () => Promise<T>) {
  try {
    return await keycloakRequest()
  } catch (error) {
    if (error instanceof FetchError) {
      console.error('Original KC error', error)
      throw new KeycloakError(error.message, error.response?.status || HttpStatusCode.INTERNAL_SERVER_ERROR, error.response?._data)
    }
    throw error
  }
}

export const auth = new Auth()
