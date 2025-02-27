<template>
  <div class="w-full h-full flex flex-col gap-4 items-end">
    <div class="w-fit">
      <Button icon="pi pi-plus" label="Add organisation" @click="createOrganisationVisible = true" />
    </div>
    <div class="w-full grow">
      <MasterOrganisationTable :organisations="allOrganisations ?? []" :loading="loading" />
    </div>
    <Dialog v-model:visible="createOrganisationVisible" modal class="min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Add organisation</h5>
      </template>
      <MasterOrganisationCreate
        :loading="loading"
        @onSave="onOrganisationCreated"
        @onCancel="createOrganisationVisible = false"
      ></MasterOrganisationCreate>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { organisationTypes } from '~/shared/types'
import { useMasterOrganisationStore } from '~/stores/master/organisation'

const masterOrganisationStore = useMasterOrganisationStore()
const toast = useToastService()
const router = useRouter()

const { allOrganisations, loading } = storeToRefs(masterOrganisationStore)

const createOrganisationVisible = ref(false)

await masterOrganisationStore.getAll()

const onOrganisationCreated = async (data: organisationTypes.CreateBodyMaster) => {
  try {
    await masterOrganisationStore.create(data)
    toast.predefined.organisation.created.success()
    createOrganisationVisible.value = false
  } catch (error) {
    toast.predefined.organisation.created.error()
    throw error
  }
}

const onOrganisationDeleted = async (organisationId: string) => {
  try {
    // await masterOrganisationStore.delete(organisationId)
    toast.predefined.organisation.deleted.success()
  } catch (error) {
    toast.predefined.organisation.deleted.error()
    throw error
  }
}

const onOrganisationSelected = (organisationId: string) => {
  router.push({ path: `/admin/home/organisations/${organisationId}` })
}
</script>

<style></style>
