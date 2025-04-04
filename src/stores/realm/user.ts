import type { Realm } from '@prisma/client'
import type { organisationTypes, partnershipTypes, userTypes } from '~/shared/types'

export const useRealmUserStore = defineStore('realmUserStore', {
  state: () => ({
    my: undefined as userTypes.GetMy | undefined,
    all: [] as userTypes.GetAllRealm,
    user: undefined as userTypes.GetRealm | undefined,
    loading: false,
  }),
  actions: {
    async getMy(realm: Realm) {
      try {
        this.loading = true
        const user = await api.user.realm.useGetMy(realm)
        this.my = user
        return user
      } finally {
        this.loading = false
      }
    },

    async getAll(realm: Realm) {
      try {
        this.loading = true
        const users = await api.user.realm.useGetAll(realm)
        this.all = users ?? []
        return users
      } finally {
        this.loading = false
      }
    },

    async get(realm: Realm, id: string) {
      try {
        this.loading = true
        const user = await api.user.realm.useGet(id, realm)
        this.user = user
        return user
      } finally {
        this.loading = false
      }
    },

    async updateMyOrganisation(realm: Realm, body: organisationTypes.UpdateBodyRealm) {
      try {
        if (!this.my) throw new Error('User not loaded')
        this.loading = true
        const organisation = await api.organisation.realm.updateMy(realm, body)
        this.my.organisation = organisation
        return organisation
      } finally {
        this.loading = false
      }
    },

    async inviteUserToMyOrganisation(data: userTypes.InviteBody) {
      try {
        this.loading = true
        await api.user.realm.invite(data)
      } finally {
        this.loading = false
      }
    },

    async removeUsersFromMyOrganisation(data: organisationTypes.RemoveUserBodyRealm) {
      try {
        if (!this.my) throw new Error('User not loaded')
        if (!this.my.organisation) throw new Error('User does not have an organisation')
        this.loading = true
        const organisation = await api.organisation.realm.removeUsersFromMy(this.my.organisation.realm, data)
        this.my.organisation = organisation
        return organisation
      } finally {
        this.loading = false
      }
    },

    async createMyPartnerships(realm: Realm, body: partnershipTypes.CreateBody) {
      try {
        if (!this.my) throw new Error('User not loaded')
        if (!this.my.organisation) throw new Error('User does not have an organisation')
        this.loading = true
        const partnerships = await api.partnership.realm.createMy(realm, body)
        this.my.organisation.egressPartnerships.push(...partnerships)
        return partnerships
      } finally {
        this.loading = false
      }
    },

    async deleteMyIngressPartnership(realm: Realm, id: string) {
      try {
        if (!this.my) throw new Error('User not loaded')
        if (!this.my.organisation) throw new Error('User does not have an organisation')
        this.loading = true
        const partnership = await api.partnership.realm.deleteMyIngress(id, realm)
        this.my.organisation.ingressPartnerships = this.my.organisation.ingressPartnerships.filter((p) => p.id !== partnership.id)
        return partnership
      } finally {
        this.loading = false
      }
    },

    async deleteMyEgressPartnership(realm: Realm, id: string) {
      try {
        if (!this.my) throw new Error('User not loaded')
        if (!this.my.organisation) throw new Error('User does not have an organisation')
        this.loading = true
        const partnership = await api.partnership.realm.deleteMyEgress(id, realm)
        this.my.organisation.egressPartnerships = this.my.organisation.egressPartnerships.filter((p) => p.id !== partnership.id)
        return partnership
      } finally {
        this.loading = false
      }
    },
  },
})
