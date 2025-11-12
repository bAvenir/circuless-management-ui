import type { Realm } from '@prisma/client'
import type { organisationTypes, partnershipTypes, userTypes } from '~/shared/types'

export const useRealmUserStore = defineStore('realmUserStore', () => {
  const loading = ref(false)
  const my = ref<userTypes.GetMy | undefined>(undefined)
  const all = ref<userTypes.GetAllRealm>([])
  const one = ref<userTypes.GetRealm | undefined>(undefined)

  async function getMy(realm: Realm) {
    try {
      loading.value = true
      const user = await api.user.realm.getMy(realm)
      my.value = user
      return user
    } finally {
      loading.value = false
    }
  }

  async function getAll(realm: Realm) {
    try {
      loading.value = true
      const users = await api.user.realm.getAll(realm)
      all.value = users ?? []
      return users
    } finally {
      loading.value = false
    }
  }

  async function get(realm: Realm, id: string) {
    try {
      loading.value = true
      const user = await api.user.realm.get(id, realm)
      one.value = user
      return user
    } finally {
      loading.value = false
    }
  }

  async function updateMyOrganisation(realm: Realm, body: organisationTypes.UpdateBodyRealm) {
    try {
      if (!my.value) throw new Error('User not loaded')
      loading.value = true
      const organisation = await api.organisation.realm.updateMy(realm, body)
      my.value.organisation = organisation
      return organisation
    } finally {
      loading.value = false
    }
  }

  async function inviteUserToMyOrganisation(realm: Realm, data: userTypes.InviteBodyRealm) {
    try {
      loading.value = true
      await api.user.realm.invite(realm, data)
    } finally {
      loading.value = false
    }
  }

  async function removeUsersFromMyOrganisation(data: organisationTypes.RemoveUserBodyRealm) {
    try {
      if (!my.value) throw new Error('User not loaded')
      if (!my.value.organisation) throw new Error('User does not have an organisation')
      loading.value = true
      const organisation = await api.organisation.realm.removeUsersFromMy(my.value.organisation.realm, data)
      my.value.organisation = organisation
      return organisation
    } finally {
      loading.value = false
    }
  }

  async function createMyPartnerships(realm: Realm, body: partnershipTypes.CreateBody) {
    try {
      if (!my.value) throw new Error('User not loaded')
      if (!my.value.organisation) throw new Error('User does not have an organisation')
      loading.value = true
      const partnerships = await api.partnership.realm.createMy(realm, body)
      my.value.organisation.egressPartnerships.push(...partnerships)
      return partnerships
    } finally {
      loading.value = false
    }
  }

  async function deleteMyIngressPartnership(realm: Realm, id: string) {
    try {
      if (!my.value) throw new Error('User not loaded')
      if (!my.value.organisation) throw new Error('User does not have an organisation')
      loading.value = true
      const partnership = await api.partnership.realm.deleteMyIngress(id, realm)
      my.value.organisation.ingressPartnerships = my.value.organisation.ingressPartnerships.filter((p) => p.id !== partnership.id)
      return partnership
    } finally {
      loading.value = false
    }
  }

  async function deleteMyEgressPartnership(realm: Realm, id: string) {
    try {
      if (!my.value) throw new Error('User not loaded')
      if (!my.value.organisation) throw new Error('User does not have an organisation')
      loading.value = true
      const partnership = await api.partnership.realm.deleteMyEgress(id, realm)
      my.value.organisation.egressPartnerships = my.value.organisation.egressPartnerships.filter((p) => p.id !== partnership.id)
      return partnership
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    my,
    all,
    one,
    getMy,
    getAll,
    get,
    updateMyOrganisation,
    inviteUserToMyOrganisation,
    removeUsersFromMyOrganisation,
    createMyPartnerships,
    deleteMyIngressPartnership,
    deleteMyEgressPartnership,
  }
})
