<template>
  <div class="w-full h-full flex flex-col gap-4">
    <div class="w-full flex items-center gap-4 justify-between px-2 sm:px-0">
      <IconField>
        <InputText type="text" v-model="filters['global'].value" placeholder="Search user..." class="w-80" />
        <InputIcon class="pi pi-search" />
      </IconField>
      <slot name="table-actions"></slot>
    </div>
    <DataTable
      :value="users ?? []"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20]"
      :filters="filters"
      :globalFilterFields="['givenName', 'familyName', 'email', 'realm', 'organisation.name']"
    >
      <Column field="id" header="Name" sortable>
        <template #body="slotProps"> {{ slotProps.data.givenName }} {{ slotProps.data.familyName }} </template>
      </Column>
      <Column field="email" header="Email" sortable />
      <Column field="realm" header="Realm" sortable />
      <Column field="organisation" header="Organisation" sortable>
        <template #body="slotProps"> {{ slotProps.data.organisation?.name ?? '---' }} </template>
      </Column>
      <Column field="id" header="Actions">
        <template #body="slotProps">
          <RealmUserActions
            :user="slotProps.data"
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
import { userTypes } from '~/shared/types'

const props = defineProps<{
  users: userTypes.GetAllRealm
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const { users } = toRefs(props)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>
