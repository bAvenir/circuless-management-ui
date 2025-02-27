import { Prisma } from '@prisma/client'
import { ClaimsUnverified } from './jwt'

declare module 'h3' {
  interface H3EventContext {
    user?: Prisma.UserGetPayload<typeof db.user.args.all>
    claims?: ClaimsUnverified
    tokens?: { access_token: string; refresh_token: string }
  }
}
