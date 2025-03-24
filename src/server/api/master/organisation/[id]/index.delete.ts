import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ params }) => {
      return await organisationManager.delete(event, params!.id)
    },
    {
      schemas: {
        params: miscTypes.IdParamSchema,
      },
      protected: true,
    }
  )
})
