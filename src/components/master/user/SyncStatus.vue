<template>
  <div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Created</Tab>
        <Tab value="1">Updated</Tab>
        <Tab value="2">Deleted</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div v-if="affectedUsers.created.length <= 0" class="text-slate-500">No users created</div>
          <div v-for="user of affectedUsers.created">
            <div>{{ user.givenName }} {{ user.familyName }}</div>
          </div>
        </TabPanel>
        <TabPanel value="1">
          <div v-if="affectedUsers.updated.length <= 0" class="text-slate-500">No users updated</div>
          <div v-for="user of affectedUsers.updated">
            <div>{{ user.givenName }} {{ user.familyName }}</div>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div v-if="affectedUsers.deleted.length <= 0" class="text-slate-500">No users deleted</div>
          <div v-for="user of affectedUsers.deleted">
            <div>{{ user.givenName }} {{ user.familyName }}</div>
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
