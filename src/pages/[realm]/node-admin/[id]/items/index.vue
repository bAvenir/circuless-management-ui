<template>
  <div class="w-full h-full flex">
    <div class="h-full grow flex flex-col lg:max-w-[400px] pt-4 lg:pt-0">
      <RealmNodeAdminItemTable :items="allMyItems" @onSelect="onItemSelected" :selectedItemId="itemId" />
    </div>
    <Divider v-if="$viewport.isGreaterThan('tablet')" layout="vertical" />
    <div v-if="$viewport.isGreaterThan('tablet')" class="grow h-full rounded-md bg-slate-100 flex items-center justify-center text-slate-300">
      No item selected
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

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
