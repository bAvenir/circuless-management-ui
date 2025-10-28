import { Realm } from '@prisma/client'
import { authTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ query }) => {
      const redirectUri = query?.redirectUri as string | undefined
      const authRedirectUrl = keycloak.logout(event, 'master', redirectUri)
      if (authRedirectUrl) {
        await sendRedirect(event, authRedirectUrl.toString())
        return
      }
      await sendRedirect(event, `${config.public.APP_URL}/`)
    },
    {
      protected: Realm.master,
      schemas: {
        query: authTypes.AuthQuerySchema,
      },
    }
  )
})
