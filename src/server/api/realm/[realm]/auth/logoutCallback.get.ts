import { Realm } from '@prisma/client'
import { miscTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      const realm = params!.realm as Realm
      keycloak.logout(event, realm)
      sendRedirect(event, `${config.public.APP_URL}/`)
    },
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
      },
    }
  )
})
