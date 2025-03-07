import type { Realm } from '@prisma/client'
import type { nodeTypes } from '~/shared/types'

export const useRealmNodeStore = defineStore('realmNodeStore', {
  state: () => ({
    realm: undefined as Realm | undefined,
    myNodes: undefined as nodeTypes.GetMyRealm | undefined,
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
        const nodes = await api.node.realm.getMy(this.realm)
        this.myNodes = nodes
        return nodes
      } finally {
        this.loading = false
      }
    },
  },
})
