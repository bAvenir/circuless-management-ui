import type { Realm } from '@prisma/client'
import type { userTypes } from '~/shared/types'

export const useRealmUserStore = defineStore('realmUserStore', {
  state: () => ({
    realm: undefined as Realm | undefined,
    allUsers: [] as userTypes.GetAllRealm,
    user: undefined as userTypes.GetRealm | undefined,
    loading: false,
  }),
  actions: {
    init(realm: Realm) {
      this.realm = realm
    },

    async getAll() {
      try {
        this.loading = true
        if (!this.realm) throw new Error('Realm not set')
        const users = await api.user.realm.getAll(this.realm)
        this.allUsers = users ?? []
        return users
      } finally {
        this.loading = false
      }
    },

    async get(id: string) {
      try {
        this.loading = true
        if (!this.realm) throw new Error('Realm not set')
        const user = await api.user.realm.get(id, this.realm)
        this.user = user
        return user
      } finally {
        this.loading = false
      }
    },
  },
})
