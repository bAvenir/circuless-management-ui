import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'

export const RealmOrganisationApi = {
  async getMy(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/organisation/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async updateMy(realm: Realm, data: organisationTypes.UpdateBodyRealm) {
    return await $fetch(`/api/realm/${realm}/organisation/my`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },
}
