import type { Realm } from '@prisma/client'
import type { partnershipTypes } from '~/shared/types'

export const RealmPartnershipApi = {
  async getMy(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/partnership/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async createMy(realm: Realm, data: partnershipTypes.CreateBody) {
    return await $fetch(`/api/realm/${realm}/partnership/my`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },
}
