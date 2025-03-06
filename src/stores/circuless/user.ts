import type { userTypes } from '~/shared/types'

export const useCirculessUserStore = defineStore('circulessUserStore', {
  state: () => ({
    loading: false,
  }),
  actions: {
    async invite(data: userTypes.InviteBody) {
      try {
        this.loading = true
        await api.user.circuless.invite(data)
      } finally {
        this.loading = false
      }
    },
  },
})
