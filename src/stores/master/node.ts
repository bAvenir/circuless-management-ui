import type { nodeTypes } from '~/shared/types'

export const useMasterNodeStore = defineStore('masterNodeStore', {
  state: () => ({
    allNodes: [] as nodeTypes.GetAllMaster,
    node: undefined as nodeTypes.GetMaster | undefined,
    loading: false,
  }),
  actions: {
    async create(data: nodeTypes.CreateBodyMaster) {
      try {
        this.loading = true
        const node = await api.node.master.create(data)
        this.allNodes?.push(node)
        return node
      } finally {
        this.loading = false
      }
    },

    async getAll() {
      try {
        this.loading = true
        const nodes = await api.node.master.getAll()
        this.allNodes = nodes ?? []
        return nodes
      } finally {
        this.loading = false
      }
    },

    async get(id: string) {
      try {
        this.loading = true
        const node = await api.node.master.get(id)
        this.node = node
        return node
      } finally {
        this.loading = false
      }
    },
  },
})
