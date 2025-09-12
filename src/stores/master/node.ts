import type { nodeTypes } from '~/shared/types'

export const useMasterNodeStore = defineStore('masterNodeStore', () => {
  const loading = ref(false)

  const allMy = ref<nodeTypes.GetAllMaster>([])
  const my = ref<nodeTypes.GetMaster | undefined>(undefined)

  async function create(data: nodeTypes.CreateBody) {
    try {
      loading.value = true
      const node = await api.node.master.create(data)
      allMy.value.push(node.node)
      return node
    } finally {
      loading.value = false
    }
  }

  async function getAll() {
    try {
      loading.value = true
      const nodes = await api.node.master.getAll()
      allMy.value = nodes ?? []
      return nodes
    } finally {
      loading.value = false
    }
  }

  async function get(id: string) {
    try {
      loading.value = true
      const node = await api.node.master.get(id)
      my.value = node
      return node
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    allMy,
    my,
    create,
    getAll,
    get,
  }
})
