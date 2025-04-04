import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'

export const useRealmOrganisationStore = defineStore('realmOrganisationStore', {
  state: () => ({
    all: [] as organisationTypes.GetAllRealm,
    loading: false,
  }),
  actions: {
    async getAll(realm: Realm) {
      try {
        this.loading = true
        const organisations = await api.organisation.realm.useGetAll(realm)
        this.all = organisations ?? []
        return organisations
      } finally {
        this.loading = false
      }
    },
  },
})
