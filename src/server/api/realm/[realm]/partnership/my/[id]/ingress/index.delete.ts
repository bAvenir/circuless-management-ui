import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => {
      if (!user?.organisationId) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }

      return await db.partnership.queries.deleteOrganisationIngress(params!.id, user.organisationId, db.partnership.args.all)
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.AllRealmsParamSchema.concat(miscTypes.IdParamSchema),
      },
    }
  )
})
