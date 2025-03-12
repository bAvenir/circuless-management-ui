import type { Realm } from '@prisma/client'
import type { nodeTypes } from '~/shared/types'

export const useRealmNodeStore = defineStore('realmNodeStore', {
  state: () => ({
    realm: undefined as Realm | undefined,
    allMy: undefined as nodeTypes.GetAllMyRealm | undefined,
    loading: false,
  }),
  actions: {
    init(realm: Realm) {
      this.realm = realm
    },

    async getAllMy() {
      try {
        this.loading = true
        if (!this.realm) throw new Error('Realm not set')
        const nodes = await api.node.realm.getAllMy(this.realm)
        this.allMy = nodes
        return nodes
      } finally {
        this.loading = false
      }
    },
  },
})
