import type { Realm } from '@prisma/client'
import type { nodeTypes } from '~/shared/types'

export const useRealmNodeStore = defineStore('realmNodeStore', {
  state: () => ({
    allMy: undefined as nodeTypes.GetAllMyRealm | undefined,
    loading: false,
  }),
  actions: {

    async getAllMy(realm: Realm) {
      try {
        this.loading = true
        const nodes = await api.node.realm.getAllMy(realm)
        this.allMy = nodes
        return nodes
      } finally {
        this.loading = false
      }
    },
  },
})
