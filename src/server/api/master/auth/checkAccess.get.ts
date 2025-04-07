import { Realm } from '@prisma/client'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async () => {
      try {
        await keycloak.checkAccess(event, Realm.master)
      } catch (error) {
        if (error instanceof CustomError && error.statusCode === HttpStatusCode.UNAUTHORIZED) {
          return false
        }
        throw error
      }
      return true
    },
    {
      protected: false,
    }
  )
})
