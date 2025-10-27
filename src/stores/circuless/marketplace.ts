import type { marketplaceTypes } from '~/shared/types'

export const useCirculessMarketplaceStore = defineStore('circulessMarketplaceStore', () => {
  const loading = ref(false)

  const all = ref<marketplaceTypes.GetAllCirculess>([])
  const one = ref<marketplaceTypes.GetOneCirculess | undefined>(undefined)

  async function getAll() {
    try {
      loading.value = true
      const datasets = await api.marketplace.circuless.getAll()
      all.value = datasets ?? []
      return datasets
    } finally {
      loading.value = false
    }
  }

  async function get(id: string) {
    try {
      loading.value = true
      const dataset = await api.marketplace.circuless.get(id)
      one.value = dataset
      return dataset
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    all,
    one,
    getAll,
    get,
  }
})
