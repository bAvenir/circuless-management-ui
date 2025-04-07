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
    return await $fetch(`/api/master/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },

  async get(id: string) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await $fetch(`/api/master/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
