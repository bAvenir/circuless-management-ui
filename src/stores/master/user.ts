import type { userTypes } from '~/shared/types'

export const useMasterUserStore = defineStore('masterUserStore', {
  state: () => ({
    allUsers: [] as userTypes.GetAllMaster,
    user: undefined as userTypes.GetMaster | undefined,
    loading: false,
  }),
  actions: {
    async invite(data: userTypes.InviteBody) {
      try {
        this.loading = true
        await api.user.master.invite(data)
      } finally {
        this.loading = false
      }
    },

    async getAll() {
      try {
        this.loading = true
        const users = await api.user.master.useGetAll()
        this.allUsers = users ?? []
        return users
      } finally {
        this.loading = false
      }
    },

    async get(id: string) {
      try {
        this.loading = true
        const user = await api.user.master.useGet(id)
        this.user = user
        return user
      } finally {
        this.loading = false
      }
    },

    async sync() {
      try {
        this.loading = true
        const affected = await api.user.master.sync()

        this.allUsers = this.allUsers?.concat(affected.created) ?? []
        this.allUsers = this.allUsers?.map((u) => affected.updated.find((d) => d.id === u.id) ?? u) ?? []
        this.allUsers = this.allUsers?.filter((u) => !affected.deleted.find((d) => d.id === u.id)) ?? []

        const deleteUser = affected.deleted.find((d) => d.id === this.user?.id)
        const updateUser = affected.updated.find((d) => d.id === this.user?.id)

        if (updateUser) this.user = updateUser
        if (deleteUser) this.user = undefined

        return affected
      } finally {
        this.loading = false
      }
    },
  },
})
