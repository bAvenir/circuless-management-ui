import { Realm } from '@prisma/client'
import { authTypes, miscTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, query }) => {
      const realm = params!.realm as Realm
      await keycloak.login(event, query!.code as string, realm)
      sendRedirect(event, `${config.public.APP_URL}/${realm}`)
    },
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
    }
  )
})
