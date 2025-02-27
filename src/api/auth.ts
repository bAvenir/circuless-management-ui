import type { Realm } from '@prisma/client'

export const AuthApi = {
  async checkAccess(realm: Realm) {
    return await $fetch(`/api/${realm}/auth/checkAccess`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
