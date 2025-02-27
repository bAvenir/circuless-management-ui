import type { Realm } from '@prisma/client'

export const RealmOrganisationApi = {
  async getMy(realm: Realm) {
    return await useFetch(`/api/${realm}/organisation/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },
}
