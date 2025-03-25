import { Realm } from '@prisma/client'
import { miscTypes, organisationTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, body, user }) => {
      if (!user?.organisationId) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }
      const data = body as organisationTypes.RemoveUserBodyRealm
      return await db.organisation.queries.removeUsersRealm(user.organisationId, params!.realm as Realm, data, db.organisation.args.my)
    },
    {
      schemas: {
        params: miscTypes.AllRealmsParamSchema,
        body: organisationTypes.RemoveUserBodyRealmSchema,
      },
      protected: true,
    }
  )
})
