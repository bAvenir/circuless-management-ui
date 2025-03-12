import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'

export const useRealmOrganisationStore = defineStore('realmOrganisationStore', {
  state: () => ({
    myOrganisation: undefined as organisationTypes.GetMyRealm | undefined,
    loading: false,
  }),
  actions: {
    async getMy(realm: Realm) {
      try {
        this.loading = true
        const organisation = await api.organisation.realm.getMy(realm)
        this.myOrganisation = organisation
        return organisation
      } finally {
        this.loading = false
      }
    },
  },
})
