<template>
  <div v-if="my" class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation partnerships" class="w-full h-full flex flex-col">
      <div class="w-full h-full flex flex-col items-end">
        <div class="w-fit">
          <Button icon="pi pi-plus" label="Add partnership" @click="createPartnershipVisible = true" />
        </div>
        <RealmOraganisationAdminPartnerships :my="my.organisation" :loading="loading" class="w-full" />
      </div>
    </Panel>
    <div v-else class="flex flex-col h-full w-full gap-7">
      <div class="w-full relative">
        <div class="font-medium">Organisation partnerships</div>
        <div class="w-fit -top-[60px] right-0 absolute">
          <Button icon="pi pi-plus" label="Add partnership" @click="createPartnershipVisible = true" />
        </div>
      </div>
      <RealmOraganisationAdminPartnerships :my="my.organisation" :loading="loading" />
    </div>
    <Dialog v-model:visible="createPartnershipVisible" modal class="min-w-[375px] lg:min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Create partnership</h5>
      </template>
      <RealmPartnershipCreate
        realm="circuless"
        :kcOrganisationId="my?.organisation?.kcId"
        :loading="loading"
        @onSave="onPartnershipCreated"
        @onCancel="createPartnershipVisible = false"
      ></RealmPartnershipCreate>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import type { partnershipTypes } from '~/shared/types'
import { useRealmUserStore } from '~/stores/realm/user'

const realmUserStore = useRealmUserStore()
const toast = useToastService()
const route = useRoute()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmUserStore)
const createPartnershipVisible = ref(false)

const onPartnershipCreated = async (data: partnershipTypes.CreateBody) => {
  try {
    await realmUserStore.createMyPartnership(realm.value, data)
    toast.predefined.partnership.created.success()
    createPartnershipVisible.value = false
  } catch (error) {
    toast.predefined.partnership.created.error()
    throw error
  }
}

const onPartnershipDeleted = async (partnershipId: string) => {
  try {
    // await masterPartnershipStore.delete(partnershipId)
    toast.predefined.partnership.deleted.success()
  } catch (error) {
    toast.predefined.partnership.deleted.error()
    throw error
  }
}
</script>

<style></style>
