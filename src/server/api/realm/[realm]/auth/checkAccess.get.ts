import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      const realm = params!.realm as Realm
      await keycloak.checkAccess(event, realm)
      return true
    },
    {
      schemas: {
        params: miscTypes.AllRealmsParamSchema,
      },
    }
  )
})
