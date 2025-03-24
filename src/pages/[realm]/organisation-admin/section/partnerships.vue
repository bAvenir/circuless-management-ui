<template>
  <div v-if="myUser" class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation partnerships" class="w-full h-full flex flex-col">
      <div class="w-full h-full flex flex-col items-end">
        <div class="w-fit">
          <Button
            icon="pi pi-plus"
            label="Add partnership"
            @click="createPartnershipVisible = true"
            :loading="loadingOrganisation"
            severity="secondary"
          />
        </div>
        <div class="w-full h-[calc(100dvh-200px)] overflow-y-auto">
          <RealmOraganisationAdminPartnerships
            :my="myUser.organisation"
            :loading="loadingUser"
            @onSelect="onPartnershipSelected"
            @onDelete="onPartnershipDeleted"
          />
        </div>
      </div>
    </Panel>
    <div v-else class="flex flex-col h-full w-full gap-3">
      <div class="w-full relative">
        <div class="font-medium">Organisation partnerships</div>
        <div class="w-fit -top-[60px] right-0 absolute">
          <Button
            icon="pi pi-plus"
            label="Add partnership"
            @click="createPartnershipVisible = true"
            :loading="loadingOrganisation"
            severity="secondary"
          />
        </div>
      </div>
      <RealmOraganisationAdminPartnerships
        :my="myUser.organisation"
        :loading="loadingUser"
        @onSelect="onPartnershipSelected"
        @onDelete="onPartnershipDeleted"
      />
    </div>
    <Dialog v-model:visible="createPartnershipVisible" modal class="min-w-[375px] lg:min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Create partnership</h5>
      </template>
      <RealmPartnershipCreate
        v-if="!loadingOrganisation"
        :organisations="allOrganisations?.filter((org) => org.id !== myUser?.organisation?.id) ?? []"
        :loading="loadingUser"
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
import { useRealmOrganisationStore } from '~/stores/realm/organisation'

const realmUserStore = useRealmUserStore()
const realmOrganisationStore = useRealmOrganisationStore()
const toast = useToastService()
const route = useRoute()

const realm = ref(route.params.realm as Realm)
const { my: myUser, loading: loadingUser } = storeToRefs(realmUserStore)
const { all: allOrganisations, loading: loadingOrganisation } = storeToRefs(realmOrganisationStore)
const createPartnershipVisible = ref(false)

await realmOrganisationStore.getAll(realm.value)

const onPartnershipCreated = async (data: partnershipTypes.CreateBody) => {
  try {
    await realmUserStore.createMyPartnerships(realm.value, data)
    toast.predefined.partnership.created.success()
    createPartnershipVisible.value = false
  } catch (error) {
    toast.predefined.partnership.created.error()
    throw error
  }
}

const onPartnershipSelected = async (partnership: partnershipTypes.GetMyIngress | partnershipTypes.GetMyEgress) => {
  console.log(partnership)
}

const onPartnershipDeleted = async (partnership: partnershipTypes.GetMyIngress | partnershipTypes.GetMyEgress) => {
  try {
    const organisation = myUser.value?.organisation
    if (!organisation) return
    if (!partnership) return
    if (partnership.from?.id === organisation.id) {
      await realmUserStore.deleteMyEgressPartnership(realm.value, partnership.id)
      toast.predefined.partnership.deleted.success()
    } else if (partnership.to?.id === organisation.id) {
      await realmUserStore.deleteMyIngressPartnership(realm.value, partnership.id)
      toast.predefined.partnership.deleted.success()
    }
  } catch (error) {
    toast.predefined.partnership.deleted.error()
    throw error
  }
}
</script>

<style></style>
