import { miscTypes, organisationTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, body }) => {
      if (!user?.organisationId) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }
      const data = body as organisationTypes.UpdateBodyRealm
      return await organisationManager.update(event, user.organisationId, data)
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
        body: organisationTypes.UpdateBodyRealmSchema,
      },
    }
  )
})
