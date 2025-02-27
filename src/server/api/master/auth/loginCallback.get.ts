import { authTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ query }) => {
      await auth.login(event, query!.code as string, 'master')
      sendRedirect(event, '/master/users')
    },
    {
      schemas: {
        query: authTypes.KeycloakAuthCodeQuerySchema,
      },
    }
  )
})
