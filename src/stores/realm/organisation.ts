import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'

export const useRealmOrganisationStore = defineStore('realmOrganisationStore', {
  state: () => ({
    // my: undefined as organisationTypes.GetMyRealm | undefined,
    loading: false,
  }),
  actions: {

  },
})
