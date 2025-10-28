import { authTypes, miscTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, query }) => {
      const realm = params!.realm as miscTypes.RealmTypes
      const authRedirectUrl = await keycloak.login(event, query!.code as string, query!.state as string, realm)
      if (authRedirectUrl) {
        await sendRedirect(event, authRedirectUrl.toString())
        return
      }
      await sendRedirect(event, `${config.public.APP_URL}/${realm}`)
    },
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
      protected: false,
    }
  )
})
