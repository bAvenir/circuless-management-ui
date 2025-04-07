import { authTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ query }) => {
      await keycloak.login(event, query!.code as string, 'master')
      sendRedirect(event, `${config.public.APP_URL}/master/users`)
    },
    {
      schemas: {
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
    }
  )
})
