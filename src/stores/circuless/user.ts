import type { userTypes } from '~/shared/types'

export const useCirculessUserStore = defineStore('circulessUserStore', () => {
  const loading = ref(false)

  async function invite(data: userTypes.InviteBodyRealm) {
    try {
      loading.value = true
      await api.user.realm.invite('circuless', data)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    invite,
  }
})
