<template>
  <div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">
          <div class="flex items-center gap-2">
            <div>Created</div>
            <Badge severity="secondary" :value="affectedOrganisations.created.length" rounded></Badge>
          </div>
        </Tab>
        <Tab value="1"
          ><div class="flex items-center gap-2">
            <div>Updated</div>
            <Badge severity="secondary" :value="affectedOrganisations.updated.length" rounded></Badge>
          </div>
        </Tab>
        <Tab value="2"
          ><div class="flex items-center gap-2">
            <div>Deleted</div>
            <Badge severity="secondary" :value="affectedOrganisations.deleted.length" rounded></Badge>
          </div>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div v-if="affectedOrganisations.created.length <= 0" class="text-slate-500">No organisations created</div>
          <div v-for="organisation of affectedOrganisations.created" class="border-b border-slate-200 w-full py-4 text-sm">
            <div class="text-lg">{{ organisation.name }}</div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Realm:</div>
              <div>{{ organisation.realm }}</div>
            </div>
            <div class="text-sm text-slate-500">id: {{ organisation.id }}</div>
            <div class="text-sm text-slate-500">kcId: {{ organisation.kcId }}</div>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div v-if="affectedOrganisations.updated.length <= 0" class="text-slate-500">No organisations updated</div>
          <div v-for="organisation of affectedOrganisations.updated" class="border-b border-slate-200 w-full py-4 text-sm">
            <div class="text-lg">{{ organisation.name }}</div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Realm:</div>
              <div>{{ organisation.realm }}</div>
            </div>
            <div class="text-sm text-slate-500">id: {{ organisation.id }}</div>
            <div class="text-sm text-slate-500">kcId: {{ organisation.kcId }}</div>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div v-if="affectedOrganisations.deleted.length <= 0" class="text-slate-500">No organisations deleted</div>
          <div v-for="organisation of affectedOrganisations.deleted" class="border-b border-slate-200 w-full py-4 text-sm">
            <div class="text-lg">{{ organisation.name }}</div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Realm:</div>
              <div>{{ organisation.realm }}</div>
            </div>
            <div class="text-sm text-slate-500">id: {{ organisation.id }}</div>
            <div class="text-sm text-slate-500">kcId: {{ organisation.kcId }}</div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import type { organisationTypes } from '~/shared/types'

const props = defineProps<{
  affectedOrganisations: organisationTypes.Sync
}>()

const { affectedOrganisations } = toRefs(props)
</script>

<style></style>
