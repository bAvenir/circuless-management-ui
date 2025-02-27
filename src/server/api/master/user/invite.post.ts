import { userTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ body }) => {
      const data = body as userTypes.InviteBody
      await userManager.invite(event, data)
      return 'User invitation sent'
    },
    {
      schemas: {
        body: userTypes.InviteBodySchema,
      },
      protected: true,
    }
  )
})
