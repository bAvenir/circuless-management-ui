import type { Realm } from '@prisma/client'

export const RealmNodeApi = {
  async getMy(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/node/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },
}
