import { ParthershipStatus } from '@prisma/client'
import { miscTypes, partnershipTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, body }) => {
      const data = body as partnershipTypes.CreateBody
      if (!user?.organisation) {
        throw new ApplicationError('User has no organisation', HttpStatusCode.FORBIDDEN)
      }
      return await db.partnership.queries.create(
        data.toIds
          .filter((id) => id !== user.organisation?.id)
          .map((toId) => ({
            fromId: user.organisation!.id,
            toId,
            status: ParthershipStatus.PENDING,
          })),
        db.partnership.args.all
      )
    },
    {
      schemas: {
        body: partnershipTypes.CreateBodySchema,
        params: miscTypes.ClientRealmsParamSchema,
      },
      protected: true,
    }
  )
})
