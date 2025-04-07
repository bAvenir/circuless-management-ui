import type { userTypes } from '~/shared/types'

export const useMasterUserStore = defineStore('masterUserStore', () => {
  const loading = ref(false)

  const all = ref<userTypes.GetAllMaster>([])
  const one = ref<userTypes.GetMaster | undefined>(undefined)

  async function invite(data: userTypes.InviteBody) {
    try {
      loading.value = true
      await api.user.master.invite(data)
    } finally {
      loading.value = false
    }
  }

  async function getAll() {
    try {
      loading.value = true
      const users = await api.user.master.getAll()
      all.value = users ?? []
      return users
    } finally {
      loading.value = false
    }
  }

  async function get(id: string) {
    try {
      loading.value = true
      const user = await api.user.master.get(id)
      one.value = user
      return user
    } finally {
      loading.value = false
    }
  }

  async function sync() {
    try {
      loading.value = true
      const affected = await api.user.master.sync()

      all.value = all.value?.concat(affected.created) ?? []
      all.value = all.value?.map((u) => affected.updated.find((d) => d.id === u.id) ?? u) ?? []
      all.value = all.value?.filter((u) => !affected.deleted.find((d) => d.id === u.id)) ?? []

      const deleteUser = affected.deleted.find((d) => d.id === one.value?.id)
      const updateUser = affected.updated.find((d) => d.id === one.value?.id)

      if (updateUser) one.value = updateUser
      if (deleteUser) one.value = undefined

      return affected
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    all,
    one,
    invite,
    getAll,
    get,
    sync,
  }
})
