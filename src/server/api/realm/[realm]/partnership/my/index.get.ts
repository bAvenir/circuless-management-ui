import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user }) => {
      if (!user?.organisationId) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }
      const [ingressPartnerships, egressPartnerships] = await Promise.all([
        db.partnership.queries.getAllOrganisationIngress(user.organisationId, db.partnership.args.all),
        db.partnership.queries.getAllOrganisationEgress(user.organisationId, db.partnership.args.all),
      ])
      return {
        ingressPartnerships,
        egressPartnerships,
      }
    },
    {
      protected: true,
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
    }
  )
})
