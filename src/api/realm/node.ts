import type { Realm } from '@prisma/client'
import type { nodeTypes } from '~/shared/types'

export const RealmNodeApi = {

  async create(realm: Realm, data: nodeTypes.CreateBodyRealm) {
    return await $fetch(`/api/realm/${realm}/node/my`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

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
