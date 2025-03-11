<template>
  <div class="w-full h-full flex flex-col gap-4 items-end">
    <div class="w-fit">
      <Button icon="pi pi-plus" label="Add organisation" @click="createOrganisationVisible = true" />
    </div>
    <div class="w-full grow">
      <MasterOrganisationTable
        :organisations="allOrganisations ?? []"
        :loading="loading"
        @onSelect="onOrganisationSelected"
        @onDelete="onOrganisationDeleted"
      >
        <template #table-actions>
          <Button icon="pi pi-refresh" label="Sync organisations" severity="secondary" @click="syncOrganisations" :loading="loading" />
        </template>
      </MasterOrganisationTable>
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
    <Dialog v-model:visible="syncedOrganisationsVisible" modal class="min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Affected organisations</h5>
      </template>
      <MasterOrganisationSyncStatus :affectedOrganisations="affectedOrganisations" />
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
const syncedOrganisationsVisible = ref(false)

const affectedOrganisations = ref<organisationTypes.Sync>({ created: [], updated: [], deleted: [] })

await masterOrganisationStore.getAll()

const syncOrganisations = async () => {
  try {
    affectedOrganisations.value = await masterOrganisationStore.sync()
    toast.predefined.organisation.synced.success()
    syncedOrganisationsVisible.value = true
  } catch (error) {
    toast.predefined.organisation.synced.error()
    throw error
  }
}

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
    await masterOrganisationStore.delete(organisationId)
    toast.predefined.organisation.deleted.success()
  } catch (error) {
    toast.predefined.organisation.deleted.error()
    throw error
  }
}

const onOrganisationSelected = (organisationId: string) => {
  router.push({ path: `/master/organisations/${organisationId}/users` })
}
</script>

<style></style>
