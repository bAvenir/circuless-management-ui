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

  async getAll(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/organisation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async get(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/realm/${realm}/organisation/${id}`, {
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

  async removeUsersFromMy(realm: Realm, data: organisationTypes.RemoveUserBodyRealm) {
    return await $fetch(`/api/realm/${realm}/organisation/my/remove-users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },
}
