import { Realm } from '@prisma/client'
import { authTypes, miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, query }) => {
      const realm = params!.realm as Realm
      await auth.login(event, query!.code as string, realm)
      sendRedirect(event, `/${realm}/${realm}`)
    },
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
    }
  )
})
