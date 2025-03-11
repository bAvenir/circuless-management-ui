import type { organisationTypes, userTypes } from '~/shared/types'

export const useMasterOrganisationStore = defineStore('masterOrganisationStore', {
  state: () => ({
    allOrganisations: [] as organisationTypes.GetAllMaster,
    organisation: undefined as organisationTypes.GetMaster | undefined,
    loading: false,
  }),
  actions: {
    async create(data: organisationTypes.CreateBodyMaster) {
      try {
        this.loading = true
        const organisation = await api.organisation.master.create(data)
        this.allOrganisations?.push(organisation)
        return organisation
      } finally {
        this.loading = false
      }
    },

    async getAll() {
      try {
        this.loading = true
        const organisations = await api.organisation.master.getAll()
        this.allOrganisations = organisations ?? []
        return organisations
      } finally {
        this.loading = false
      }
    },

    async get(id: string) {
      try {
        this.loading = true
        const organisation = await api.organisation.master.get(id)
        this.organisation = organisation
        return organisation
      } finally {
        this.loading = false
      }
    },

    async delete(id: string) {
      try {
        this.loading = true
        await api.organisation.master.delete(id)
        this.allOrganisations = this.allOrganisations?.filter((o) => o.id !== id) ?? []
        this.organisation = this.organisation?.id === id ? undefined : this.organisation
      } finally {
        this.loading = false
      }
    },

    async inviteUser(data: userTypes.InviteBody) {
      try {
        this.loading = true
        await api.user.master.invite(data)
      } finally {
        this.loading = false
      }
    },

    async sync() {
      try {
        this.loading = true
        const affected = await api.organisation.master.sync()

        this.allOrganisations = this.allOrganisations?.concat(affected.created) ?? []
        this.allOrganisations = this.allOrganisations?.map((u) => affected.updated.find((d) => d.id === u.id) ?? u) ?? []
        this.allOrganisations = this.allOrganisations?.filter((u) => !affected.deleted.find((d) => d.id === u.id)) ?? []

        const deleteOrganisation = affected.deleted.find((d) => d.id === this.organisation?.id)
        const updateOrganisation = affected.updated.find((d) => d.id === this.organisation?.id)

        if (updateOrganisation) this.organisation = updateOrganisation
        if (deleteOrganisation) this.organisation = undefined

        return affected
      } finally {
        this.loading = false
      }
    },
  },
})
