import type { Realm } from '@prisma/client'

export const RealmNodeApi = {
  async useGetMy(id:string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id') 
    return await useFetch(`/api/realm/${realm}/node/my/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async useGetAllMy(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/node/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },
}
