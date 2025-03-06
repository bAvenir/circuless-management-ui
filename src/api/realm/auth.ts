import type { Realm } from '@prisma/client'

export const RealmAuthApi = {
  async checkAccess(realm: Realm) {
    return await $fetch(`/api/realm/${realm}/auth/checkAccess`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
