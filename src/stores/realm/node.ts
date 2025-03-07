import type { miscTypes, nodeTypes } from '~/shared/types'

export const useRealmNodeStore = defineStore('realmNodeStore', {
  state: () => ({
    realm: undefined as miscTypes.ClientRealms | undefined,
    myNodes: undefined as nodeTypes.GetMyRealm | undefined,
    loading: false,
  }),
  actions: {
    init(realm: miscTypes.ClientRealms) {
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
