import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'

export const useRealmOrganisationStore = defineStore('realmOrganisationStore', {
  state: () => ({
    realm: undefined as Realm | undefined,
    myOrganisation: undefined as organisationTypes.GetMyRealm | undefined,
    loading: false,
  }),
  actions: {
    init(realm: Realm) {
      this.realm = realm
    },

    async getMy() {
      try {
        this.loading = true
        if (!this.realm) throw new Error('Realm not set')
        const organisation = await api.organisation.realm.getMy(this.realm)
        this.myOrganisation = organisation
        return organisation
      } finally {
        this.loading = false
      }
    },
  },
})
