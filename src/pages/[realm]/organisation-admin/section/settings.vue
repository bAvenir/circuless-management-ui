<template>
  <div v-if="my" class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation settings" class="w-full h-full flex flex-col">
      <RealmOraganisationAdminSettings :my="my.organisation" :loading="loading" @onSave="onOrganisationUpdated" />
    </Panel>
    <div v-else class="flex flex-col h-full w-full gap-5">
      <div class="font-medium">Organisation settings</div>
      <RealmOraganisationAdminSettings :my="my.organisation" :loading="loading" @onSave="onOrganisationUpdated"  />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import type { organisationTypes } from '~/shared/types'
import { useRealmUserStore } from '~/stores/realm/user'

const route = useRoute()
const realmUserStore = useRealmUserStore()
const toast = useToastService()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmUserStore)

const onOrganisationUpdated = async (data: organisationTypes.UpdateBodyRealm) => {
  try {
    await realmUserStore.updateMyOrganisation(realm.value, data)
    toast.predefined.organisation.updated.success()
  } catch (error) {
    toast.predefined.organisation.updated.error()
    throw error
  }
}
</script>

<style></style>
