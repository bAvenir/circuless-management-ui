import { authTypes, miscTypes } from '~/shared/types'

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params, query }) => {
      const realm = params!.realm as miscTypes.RealmTypes
      const redirectUri = query?.redirectUri as string | undefined
      const redirectUrl = await keycloak.logout(event, realm, redirectUri)
      if (redirectUrl) {
        return await sendRedirect(event, redirectUrl.toString())
      }
      return await sendRedirect(event, `${config.public.APP_URL}`)
    },
    {
      schemas: {
        params: miscTypes.ClientRealmsParamSchema,
        query: authTypes.AuthQuerySchema,
      },
      protected: true,
    }
  )
})
