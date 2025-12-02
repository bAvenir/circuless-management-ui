<template>
  <div class="w-full h-auto flex flex-col gap-6 py-6 px-5">
    <div>
      <h1 class="text-3xl font-bold">Discovery</h1>
      <p class="text-gray-500 mt-1">Browse and explore available Thing Descriptions (WoT).</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-4 items-center">
      <input
        v-model="search"
        type="text"
        placeholder="Search Thing Descriptions..."
        class="w-full lg:w-1/2 border rounded-xl px-4 py-2 shadow-sm"
      />

      <select v-model="selectedType" class="border rounded-xl px-4 py-2 shadow-sm bg-white">
        <option value="all">All Types</option>
        <option value="property">Properties</option>
        <option value="action">Actions</option>
        <option value="event">Events</option>
      </select>
    </div>

    <div class="flex flex-col gap-4">
      <RealmTdsTDCard v-for="td in filteredTDs" :key="td.id" :td="td" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTDFilter } from '~/composables/useTDFilter'
import { TDsManagement, type FetchThingDescription } from '~/api/realm/td'
import { Realm } from '@prisma/client'

const search = ref('')
const selectedType = ref('all')

const route = useRoute()
const realm = route.params.realm as Realm
const nodeID = route.params.nodeID as string

const { data: thingDescriptions } = await useAsyncData<FetchThingDescription[]>(
  'TDs',
  async () => TDsManagement.getAllTDs(realm, nodeID))

console.log('thingDescriptions:', thingDescriptions)

const { filtered: filteredTDs } = useTDFilter(thingDescriptions, search, selectedType)
</script>
