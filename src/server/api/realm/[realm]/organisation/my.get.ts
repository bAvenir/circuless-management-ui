import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => {
      if (!user?.organisationId) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }
      return await db.organisation.queries.getRealm(user.organisationId, params!.realm as miscTypes.ClientRealms, db.organisation.args.all)
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
    }
  )
})
