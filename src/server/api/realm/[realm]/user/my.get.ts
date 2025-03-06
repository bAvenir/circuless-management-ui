import { miscTypes } from '~/shared/types'

export default defineEventHandler(async (event) => {
  return await apiWrapper(event, async ({ user }) => user, {
    schemas: {
      params: miscTypes.AllRealmsParamSchema,
    },
    protected: true,
  })
})
