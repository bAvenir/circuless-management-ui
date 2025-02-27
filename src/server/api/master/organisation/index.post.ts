import { organisationTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ body }) => {
      const data = body as organisationTypes.CreateBodyMaster
      return await organisationManager.create(event, data)
    },
    {
      schemas: {
        body: organisationTypes.CreateBodyMasterSchema,
      },
      protected: true,
    }
  )
})
