import type { userTypes } from '~/shared/types'

export const MasterUserApi = {
  async invite(data: userTypes.InviteBody) {
    return await $fetch(`/api/master/user/invite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },

  async getAll() {
    return await useFetch(`/api/master/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async get(id: string) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/master/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async sync() {
    return await $fetch(`/api/master/user/sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
}
