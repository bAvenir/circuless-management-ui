import type { userTypes } from '~/shared/types'

export const useCirculessUserStore = defineStore('circulessUserStore', () => {
  const loading = ref(false)

  async function invite(data: userTypes.InviteBody) {
    try {
      loading.value = true
      await api.user.realm.invite(data)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    invite,
  }
})
