<template>
  <div class="w-full h-full flex flex-col gap-4">
    <div class="w-full flex items-center gap-4 justify-between px-2 sm:px-0">
      <IconField>
        <InputText type="text" v-model="filters['global'].value" placeholder="Search organisation..." class="w-80" />
        <InputIcon class="pi pi-search" />
      </IconField>
      <slot name="table-actions"></slot>
    </div>
    <DataTable
      :value="organisations ?? []"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20]"
      :filters="filters"
      :globalFilterFields="['name', 'realm']"
    >
      <Column field="name" header="Name" sortable />
      <Column field="realm" header="Realm" sortable />
      <Column field="id" header="Actions">
        <template #body="slotProps">
          <MasterOrganisationActions
            :organisation="slotProps.data"
            :loading="loading"
            @onSelect="(event: string) => emit('onSelect', event)"
            @onDelete="(event: string) => emit('onDelete', event)"
          />
        </template>
      </Column>
      <template #empty>
        <div class="flex items-center justify-center h-40 text-lg text-gray-400">No records found</div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { organisationTypes } from '~/shared/types'

const props = defineProps<{
  organisations: organisationTypes.GetAllMaster
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const { organisations } = toRefs(props)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>
