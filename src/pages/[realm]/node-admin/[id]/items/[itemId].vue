<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="w-full h-full flex">
    <div class="h-full grow flex flex-col overflow-y-auto lg:max-w-[400px] pt-4 lg:pt-0">
      <RealmNodeAdminItemTable :items="myItems" @onSelect="onItemSelected" />
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

const realmNodeStore = useRealmNodeStore()
const { myItems, loading } = storeToRefs(realmNodeStore)
const route = useRoute()
const router = useRouter()

const realm = ref(route.params.realm as Realm)
const nodeId = ref(route.params.id as string)

await realmNodeStore.runMyDisovery()

const onItemSelected = (itemId: string) => {
  router.push({ path: `/${realm.value}/node-admin/${nodeId.value}/items/${itemId}` })
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
