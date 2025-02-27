import type { organisationTypes } from '~/shared/types'

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
  },
})
