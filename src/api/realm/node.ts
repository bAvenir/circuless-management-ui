import type { Realm } from '@prisma/client'

export const RealmNodeApi = {
  async getMy(id:string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id') 
    return await $fetch(`/api/realm/${realm}/node/my/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async getAllMy(realm: Realm) {
    return await $fetch(`/api/realm/${realm}/node/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
