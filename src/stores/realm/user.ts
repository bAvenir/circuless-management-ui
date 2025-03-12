import type { Realm } from '@prisma/client'
import type { userTypes } from '~/shared/types'

export const useRealmUserStore = defineStore('realmUserStore', {
  state: () => ({
    my: undefined as userTypes.GetMy | undefined,
    realm: undefined as Realm | undefined,
    allUsers: [] as userTypes.GetAllRealm,
    user: undefined as userTypes.GetRealm | undefined,
    loading: false,
  }),
  actions: {
    async init(realm: Realm) {
      try {
        this.loading = true
        const user = await api.user.realm.getMy(realm)
        this.my = user
        this.realm = realm
        return user
      } finally {
        this.loading = false
      }
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
