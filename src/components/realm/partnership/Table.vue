<template>
  <div class="w-full h-full">
    <Tabs value="0">
      <TabList>
        <Tab value="0">Sent</Tab>
        <Tab value="1">Recieved</Tab>
      </TabList>
      <TabPanels class="!px-0 lg:!px-[18px]">
        <TabPanel value="0">
          <div class="w-full h-full flex flex-col gap-4 pt-5">
            <div class="w-full flex items-center gap-4 justify-between">
              <IconField>
                <InputText type="text" v-model="filters['global'].value" placeholder="Search partnerships..." class="w-80" />
                <InputIcon class="pi pi-search" />
              </IconField>
              <slot name="table-actions"></slot>
            </div>
            <DataTable
              v-if="$viewport.isLessOrEquals('tablet')"
              :value="partnerships?.egressPartnerships ?? []"
              :paginator="true"
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20]"
              :filters="filters"
              :globalFilterFields="['to.name']"
              :showHeaders="false"
            >
              <Column field="id">
                <template #body="slotProps">
                  <h4>{{ slotProps.data.to.name }}</h4>
                  <div class="mt-1 flex items-center gap-1">
                    <div class="text-realm-text-300">Realm:</div>
                    <div>{{ slotProps.data.to.realm }}</div>
                  </div>
                  <div class="mt-1 flex items-center gap-1 pb-4">
                    <Tag v-if="slotProps.data.status === 'PENDING'" severity="warn" value="Pending"></Tag>
                    <Tag v-if="slotProps.data.status === 'ACTIVE'" severity="sucess" value="Active"></Tag>
                  </div>
                  <RealmPartnershipActions
                    :partnership="slotProps.data"
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
            <DataTable
              v-else
              :value="partnerships?.egressPartnerships ?? []"
              :paginator="true"
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20]"
              :filters="filters"
              :globalFilterFields="['to.name']"
            >
              <Column field="id" header="Organisation" sortable>
                <template #body="slotProps"> {{ slotProps.data.to.name }}</template>
              </Column>
              <Column field="to.realm" header="Realm" sortable />
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.status === 'PENDING'" severity="warn" value="Pending"></Tag>
                  <Tag v-if="slotProps.data.status === 'ACTIVE'" severity="success" value="Active"></Tag>
                </template>
              </Column>
              <Column field="id" header="Actions">
                <template #body="slotProps">
                  <RealmPartnershipActions
                    :partnership="slotProps.data"
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
        </TabPanel>
        <TabPanel value="1">
          <div class="w-full h-full flex flex-col gap-4 pt-5">
            <div class="w-full flex items-center gap-4 justify-between">
              <IconField>
                <InputText type="text" v-model="filters['global'].value" placeholder="Search partnerships..." class="w-80" />
                <InputIcon class="pi pi-search" />
              </IconField>
              <slot name="table-actions"></slot>
            </div>
            <DataTable
              v-if="$viewport.isLessOrEquals('tablet')"
              :value="partnerships?.ingressPartnerships ?? []"
              :paginator="true"
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20]"
              :filters="filters"
              :globalFilterFields="['from.name']"
              :showHeaders="false"
            >
              <Column field="id">
                <template #body="slotProps">
                  <h4>{{ slotProps.data.from.name }}</h4>
                  <div class="mt-1 flex items-center gap-1">
                    <div class="text-realm-text-300">Realm:</div>
                    <div>{{ slotProps.data.from.realm }}</div>
                  </div>
                  <div class="mt-1 flex items-center gap-1 pb-4">
                    <Tag v-if="slotProps.data.status === 'PENDING'" severity="warn" value="Pending"></Tag>
                    <Tag v-if="slotProps.data.status === 'ACTIVE'" severity="sucess" value="Active"></Tag>
                  </div>
                  <RealmPartnershipActions
                    :partnership="slotProps.data"
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
            <DataTable
              v-else
              :value="partnerships?.ingressPartnerships ?? []"
              :paginator="true"
              :rows="10"
              :rowsPerPageOptions="[5, 10, 20]"
              :filters="filters"
              :globalFilterFields="['from.name']"
            >
              <Column field="id" header="Organisation" sortable>
                <template #body="slotProps"> {{ slotProps.data.from.name }}</template>
              </Column>
              <Column field="from.realm" header="Realm" sortable />
              <Column field="status" header="Status" sortable>
                <template #body="slotProps">
                  <Tag v-if="slotProps.data.status === 'PENDING'" severity="warn" value="Pending"></Tag>
                  <Tag v-if="slotProps.data.status === 'ACTIVE'" severity="success" value="Active"></Tag>
                </template>
              </Column>
              <Column field="id" header="Actions">
                <template #body="slotProps">
                  <RealmPartnershipActions
                    :partnership="slotProps.data"
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
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api'
import { partnershipTypes } from '~/shared/types'

const { partnerships } = defineProps<{
  partnerships: partnershipTypes.GetAllMy
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
</script>

<style></style>
