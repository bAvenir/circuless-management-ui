import type { organisationTypes } from '~/shared/types'

export const MasterOrganisationApi = {
  async create(data: organisationTypes.CreateBodyMaster) {
    return await $fetch('/api/master/organisation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },

  async getAll() {
    return await useFetch('/api/master/organisation', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async get(id: string) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/master/organisation/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async delete(id: string) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await $fetch(`/api/master/organisation/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async sync() {
    return await $fetch(`/api/master/organisation/sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
