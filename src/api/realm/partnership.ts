import type { Realm } from '@prisma/client'
import type { partnershipTypes } from '~/shared/types'

export const RealmPartnershipApi = {
  async createMy(realm: Realm, data: partnershipTypes.CreateBody) {
    return await $fetch(`/api/realm/${realm}/partnership/my`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },

  async useGetAllMy(realm: Realm) {
    return await useFetch(`/api/realm/${realm}/partnership/my`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async useGetMyIngress(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/realm/${realm}/partnership/my/${id}/ingress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async useGetMyEgress(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/realm/${realm}/partnership/my/${id}/egress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async deleteMyIngress(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await $fetch(`/api/realm/${realm}/partnership/my/${id}/ingress`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async deleteMyEgress(id: string, realm: Realm) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await $fetch(`/api/realm/${realm}/partnership/my/${id}/egress`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
