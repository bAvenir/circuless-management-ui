<template>
  <div>
    <div v-if="loading">Loading...</div>

    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else-if="one">
      <RealmTdsTDCard :td="one" />
    </div>
    <div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { TDsManagement, type FetchThingDescription } from '~/api/realm/td'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { Realm } from '@prisma/client'

const route = useRoute()
const itemID = String(route.params.itemID)
const realm = route.params.realm as Realm
const nodeID = route.params.nodeID  as string


const one = ref<FetchThingDescription | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await TDsManagement.getTDDetails(realm, nodeID, itemID) as FetchThingDescription | null

    if (!data) throw new Error('Could not fetch TD detail info')
    console.log('data:', data)

    return one.value = data
  } catch (e: any) {
    error.value = e.message || 'Failed to fetch data'
  } finally {
    loading.value = false
  }
})

</script>
