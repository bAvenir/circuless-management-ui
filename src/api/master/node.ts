import type { nodeTypes } from '~/shared/types'

export const MasterNodeApi = {
  async create(data: nodeTypes.CreateBodyMaster) {
    return await $fetch('/api/master/node', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
  },

  async useGetAll() {
    return await useFetch('/api/master/node', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },

  async useGet(id: string) {
    if (!isValidId(id)) throw new Error('Invalid id')
    return await useFetch(`/api/master/node/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data.value)
  },
}
