import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      const realm = params!.realm as Realm
      auth.logout(event, realm)
      sendRedirect(event, `/`)
    },
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
    }
  )
})
