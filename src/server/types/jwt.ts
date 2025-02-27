import type { JWTPayload } from 'jose'

export type OrganizationClaim<T = { id: string }> = Record<string, T>
export type ParsedOrganizationClaim = { id: string }
export type ClaimsVerified = JWTPayload & {
  sub: string
  email: string
  given_name?: string
  family_name?: string
  kcOrganisation?: ParsedOrganizationClaim// After verification, the organization is mapped form KC format {'relm_name': {id: 'orgId'}} to simpler {id: 'orgId'}
}
export type ClaimsUnverified = JWTPayload & {
  sub?: string
  email?: string
  given_name?: string
  family_name?: string
  organization?: OrganizationClaim
}
