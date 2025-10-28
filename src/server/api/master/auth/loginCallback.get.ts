import { authTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  console.log('LOGIN CALLBACK HIT')
  return await apiWrapper(
    event,
    async ({ query }) => {
      const redirectUrl = await keycloak.login(event, query!.code as string, query!.state as string, 'master')
      if (redirectUrl) {
        await sendRedirect(event, redirectUrl.toString())
        return
      }
      await sendRedirect(event, `${config.public.APP_URL}/master`)
    },
    {
      schemas: {
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
      protected: false,
    }
  )
})
