import { miscTypes, userTypes } from '~/shared/types'
import type { Realm } from '@prisma/client'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, body, params }) => {
      const data = body as userTypes.InviteBody
      const realm = params!.realm as Realm
      if (realm !== data.realm) {
        throw new ApplicationError('Cannot invite user to a different realm', HttpStatusCode.METHOD_NOT_ALLOWED)
      }
      if (!user?.organisation) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }
      if (user.organisation.realm !== realm) {
        throw new ApplicationError('User does not belong to this realm', HttpStatusCode.FORBIDDEN)
      }
      const tokens = await auth.getMasterToken(event)
      await userManager.invite(event, data, tokens.access_token)
      return 'User invitation sent'
    },
    {
      schemas: {
        body: userTypes.InviteBodySchema,
        params: miscTypes.ClientRealmsParamSchema,
      },
      protected: true,
    }
  )
})
