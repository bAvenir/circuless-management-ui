import { Realm } from '@prisma/client'
import { authTypes, miscTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, query }) => {
      const realm = params!.realm as Realm
      await auth.login(event, query!.code as string, realm)
      if (realm === 'master') {
        sendRedirect(event, `${config.public.APP_URL}/master/users`)
      } else {
        sendRedirect(event, `${config.public.APP_URL}/${realm}/${realm}`)
      }
    },
    {
      schemas: {
        params: miscTypes.AllRealmsParamSchema,
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
    }
  )
})
