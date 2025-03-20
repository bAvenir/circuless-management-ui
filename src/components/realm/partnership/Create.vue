<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex flex-col gap-4 w-full pb-8">
      <div class="w-full flex items-center gap-4 justify-between">
        <IconField>
          <InputText type="text" v-model="filters['global'].value" placeholder="Search organisation..." class="w-80" />
          <InputIcon class="pi pi-search" />
        </IconField>
        <slot name="table-actions"></slot>
      </div>
      <DataTable
        v-if="$viewport.isLessOrEquals('tablet')"
        :value="organisations ?? []"
        :filters="filters"
        :globalFilterFields="['name']"
        :showHeaders="true"
        dataKey="id"
        v-model:selection="selected"
        scrollable
        scrollHeight="flex"
        class="max-h-[360px]"
      >
        <Column selectionMode="multiple" headerClass="w-12"></Column>
        <Column field="id" header="All">
          <template #body="slotProps">
            <h4>{{ slotProps.data.name }}</h4>
            <div class="mt-1 flex items-center gap-1">
              <div class="text-realm-text-300">Realm:</div>
              <div>{{ slotProps.data.realm }}</div>
            </div>
          </template>
        </Column>
        <template #empty>
          <div class="flex items-center justify-center h-40 text-lg text-gray-400">No records found</div>
        </template>
      </DataTable>
      <DataTable
        v-else
        :value="organisations ?? []"
        :filters="filters"
        :globalFilterFields="['name']"
        dataKey="id"
        v-model:selection="selected"
        scrollable
        scrollHeight="flex"
        class="max-h-96"
      >
        <Column selectionMode="multiple"></Column>
        <Column field="id" header="Organisation" sortable>
          <template #body="slotProps"> {{ slotProps.data.name }}</template>
        </Column>
        <Column field="realm" header="Realm" sortable />
        <template #empty>
          <div class="flex items-center justify-center h-40 text-lg text-gray-400">No records found</div>
        </template>
      </DataTable>
    </div>
    <div class="flex justify-end gap-4 mt-4">
      <Button label="Cancel" @click="onCancel" severity="secondary" />
      <Button :label="requestLabel" @click="onSave" :loading="loading" :disabled="!selected || selected.length <= 0" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import type { organisationTypes } from '~/shared/types'

const { organisations, loading } = defineProps<{
  organisations: organisationTypes.GetAllRealm
  loading: boolean
}>()

const emit = defineEmits(['onSave', 'onCancel'])

const selected = ref<organisationTypes.GetAllRealm>([])

const onSave = async () => {
  const value = selected.value
  if (value && value.length > 0) {
    emit('onSave', { toIds: value.map((v) => v.id) })
  }
}

const onCancel = () => {
  emit('onCancel')
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const requestLabel = computed(() => {
  return selected.value && selected.value.length > 0 ? `Request (${selected.value.length})` : 'Request'
})
</script>
