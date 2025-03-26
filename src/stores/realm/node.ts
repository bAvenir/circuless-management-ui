import type { Realm } from '@prisma/client'
import type { nodeTypes } from '~/shared/types'

export const useRealmNodeStore = defineStore('realmNodeStore', {
  state: () => ({
    allMy: undefined as nodeTypes.GetAllMyRealm | undefined,
    my: undefined as nodeTypes.GetMyRealm | undefined,
    loading: false,
  }),
  actions: {

    async getMy(id: string, realm: Realm) {
      try {
        this.loading = true
        const node = await api.node.realm.getMy(id, realm)
        this.my = node
        return node
      } finally {
        this.loading = false
      }
    },

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
