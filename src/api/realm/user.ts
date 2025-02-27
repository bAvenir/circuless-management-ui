import type { Realm } from '@prisma/client'
import type { userTypes } from '~/shared/types'

export const RealmUserApi = {
  async invite(data: userTypes.InviteBody, realm: Realm) {
    return await $fetch(`/api/${realm}/user/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },

  async getAll(realm: Realm) {
    return await useFetch(`/api/${realm}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async get(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/${realm}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  }
}
