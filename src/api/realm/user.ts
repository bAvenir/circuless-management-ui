import type { Realm } from '@prisma/client'

export const RealmUserApi = {
  async getAll(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async get(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/realm/${realm}/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async getMy(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/user/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },
}
