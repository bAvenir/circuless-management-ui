<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="w-full h-full flex">
    <div class="h-full grow flex flex-col lg:max-w-[400px] pt-4 lg:pt-0">
      <RealmNodeAdminItemTable :items="allMyItems" @onSelect="onItemSelected" :selectedItemId="itemId" />
    </div>
    <Divider layout="vertical" />
    <div class="grow h-full">
      <NuxtPage />
    </div>
  </div>
  <div v-else class="w-full h-full">
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

definePageMeta({
  // Rerender only when node changes
  key: (route) => {
    return route.params.id as string
  },
})

const realmNodeStore = useRealmNodeStore()
const { allMyItems, loading } = storeToRefs(realmNodeStore)
const route = useRoute()
const router = useRouter()

const realm = ref(route.params.realm as Realm)
const nodeId = ref(route.params.id as string)
const itemId = ref(route.params.itemId as string)

await callOnce(async () => {
  await realmNodeStore.getMyItems()
})

const onItemSelected = (id: string) => {
  itemId.value = id
  router.push({ path: `/${realm.value}/node-admin/${nodeId.value}/items/${id}` })
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
