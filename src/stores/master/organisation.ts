import type { organisationTypes, userTypes } from '~/shared/types'

export const useMasterOrganisationStore = defineStore('masterOrganisationStore', () => {
  const loading = ref(false)

  const all = ref<organisationTypes.GetAllMaster>([])
  const one = ref<organisationTypes.GetMaster | undefined>(undefined)

  async function create(data: organisationTypes.CreateBodyMaster) {
    try {
      loading.value = true
      const organisation = await api.organisation.master.create(data)
      all.value.push(organisation)
      return organisation
    } finally {
      loading.value = false
    }
  }

  async function getAll() {
    try {
      loading.value = true
      const organisations = await api.organisation.master.getAll()
      all.value = organisations ?? []
      return organisations
    } finally {
      loading.value = false
    }
  }

  async function get(id: string) {
    try {
      loading.value = true
      const organisation = await api.organisation.master.get(id)
      one.value = organisation
      return organisation
    } finally {
      loading.value = false
    }
  }

  async function deleteOrg(id: string) {
    try {
      loading.value = true
      const organisation = await api.organisation.master.delete(id)
      all.value = all.value?.filter((o) => o.id !== id) ?? []
      one.value = one.value?.id === id ? undefined : one.value
      return organisation
    } finally {
      loading.value = false
    }
  }

  async function inviteUser(data: userTypes.InviteBodyMaster) {
    try {
      loading.value = true
      await api.user.master.invite(data)
    } finally {
      loading.value = false
    }
  }

  async function sync() {
    try {
      loading.value = true
      const affected = await api.organisation.master.sync()

      all.value = all.value.concat(affected.created) ?? []
      all.value = all.value.map((u) => affected.updated.find((d) => d.id === u.id) ?? u) ?? []
      all.value = all.value.filter((u) => !affected.deleted.find((d) => d.id === u.id)) ?? []

      const deleteOrganisation = affected.deleted.find((d) => d.id === one.value?.id)
      const updateOrganisation = affected.updated.find((d) => d.id === one.value?.id)

      if (updateOrganisation) one.value = updateOrganisation
      if (deleteOrganisation) one.value = undefined

      return affected
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    all,
    one,
    create,
    getAll,
    get,
    deleteOrg,
    inviteUser,
    sync,
  }
})
