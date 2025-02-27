<template>
  <div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">
          <div class="flex items-center gap-2">
            <div>Created</div>
            <Badge severity="secondary" :value="affectedUsers.created.length" rounded></Badge>
          </div>
        </Tab>
        <Tab value="1"
          ><div class="flex items-center gap-2">
            <div>Updated</div>
            <Badge severity="secondary" :value="affectedUsers.updated.length" rounded></Badge>
          </div>
        </Tab>
        <Tab value="2"
          ><div class="flex items-center gap-2">
            <div>Deleted</div>
            <Badge severity="secondary" :value="affectedUsers.deleted.length" rounded></Badge>
          </div>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div v-if="affectedUsers.created.length <= 0" class="text-slate-500">No users created</div>
          <div v-for="user of affectedUsers.created" class="border-b border-slate-200 w-full py-4 text-sm">
            <div class="text-lg">{{ user.givenName }} {{ user.familyName }}</div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Realm:</div>
              <div>{{ user.realm }}</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Organisation:</div>
              <div>{{ user.organisation?.name ?? '---' }}</div>
            </div>
            <div class="text-sm text-slate-500">id: {{ user.id }}</div>
            <div class="text-sm text-slate-500">kcId: {{ user.kcId }}</div>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div v-if="affectedUsers.updated.length <= 0" class="text-slate-500">No users updated</div>
          <div v-for="user of affectedUsers.updated" class="border-b border-slate-200 w-full py-4 text-sm">
            <div class="text-lg">{{ user.givenName }} {{ user.familyName }}</div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Realm:</div>
              <div>{{ user.realm }}</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Organisation:</div>
              <div>{{ user.organisation?.name ?? '---' }}</div>
            </div>
            <div class="text-sm text-slate-500">id: {{ user.id }}</div>
            <div class="text-sm text-slate-500">kcId: {{ user.kcId }}</div>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div v-if="affectedUsers.deleted.length <= 0" class="text-slate-500">No users deleted</div>
          <div v-for="user of affectedUsers.deleted" class="border-b border-slate-200 w-full py-4 text-sm">
            <div class="text-lg">{{ user.givenName }} {{ user.familyName }}</div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Realm:</div>
              <div>{{ user.realm }}</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-slate-500">Organisation:</div>
              <div>{{ user.organisation?.name ?? '---' }}</div>
            </div>
            <div class="text-sm text-slate-500">id: {{ user.id }}</div>
            <div class="text-sm text-slate-500">kcId: {{ user.kcId }}</div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

const props = defineProps<{
  affectedUsers: userTypes.Sync
}>()

const { affectedUsers } = toRefs(props)
</script>

<style></style>
