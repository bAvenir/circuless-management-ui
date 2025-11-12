import type { Realm } from '@prisma/client'
import type { userTypes } from '~/shared/types'

export const RealmUserApi = {
  async getAll(realm: Realm) {
    return await $fetch(`/api/realm/${realm}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async get(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await $fetch(`/api/realm/${realm}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async getMy(realm: Realm) {
    return await $fetch(`/api/realm/${realm}/user/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async invite(realm: Realm, data: userTypes.InviteBodyRealm) {
    return await $fetch(`/api/realm/${realm}/user/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },
}
