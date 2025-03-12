import type { Realm } from '@prisma/client'
import type { userTypes } from '~/shared/types'

export const useRealmUserStore = defineStore('realmUserStore', {
  state: () => ({
    my: undefined as userTypes.GetMy | undefined,
    allUsers: [] as userTypes.GetAllRealm,
    user: undefined as userTypes.GetRealm | undefined,
    loading: false,
  }),
  actions: {
    async getMy(realm: Realm) {
      try {
        this.loading = true
        const user = await api.user.realm.getMy(realm)
        this.my = user
        return user
      } finally {
        this.loading = false
      }
    },

    async getAll(realm: Realm) {
      try {
        this.loading = true
        const users = await api.user.realm.getAll(realm)
        this.allUsers = users ?? []
        return users
      } finally {
        this.loading = false
      }
    },

    async get(realm: Realm, id: string) {
      try {
        this.loading = true
        const user = await api.user.realm.get(id, realm)
        this.user = user
        return user
      } finally {
        this.loading = false
      }
    },
  },
})
