<template>
  <div class="w-full h-full flex items-center justify-between">
    <div
      v-if="$viewport.isGreaterThan('tablet')"
      class="grow flex items-center justify-center h-full bg-[url('/images/nodes.png')] bg-cover bg-center"
    ></div>
    <div class="w-full min-h-[calc(100dvh-3.5rem)] lg:h-full lg:w-[800px] bg-realm-secondary-950">
      <RealmNodesTable :nodes="allMy ?? []" :loading="loading" @onSelect="onNodeSelected" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const realmNodeStore = useRealmNodeStore()
const { allMy, loading } = storeToRefs(realmNodeStore)
const route = useRoute()
const router = useRouter()

const realm = ref(route.params.realm as Realm)

await callOnce(async () => {
  await realmNodeStore.getAllMy(realm.value)
})

const onNodeSelected = (nodeId: string) => {
  router.push({ path: `/${realm.value}/node-admin/${nodeId}` })
}
</script>

<style></style>
