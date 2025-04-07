import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'

export const useRealmOrganisationStore = defineStore('realmOrganisationStore', () => {
  const loading = ref(false)

  const all = ref<organisationTypes.GetAllRealm>([])

  async function getAll(realm: Realm) {
    try {
      loading.value = true
      const organisations = await api.organisation.realm.getAll(realm)
      all.value = organisations ?? []
      return organisations
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    all,
    getAll,
  }
})
