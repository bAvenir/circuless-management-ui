<template>
  <div class="w-full h-full flex items-center justify-between">
    <div v-if="$viewport.isGreaterThan('tablet')" class="grow flex items-center justify-center h-full bg-[url('/images/nodes.png')] bg-cover bg-center">
    </div>
    <div class="w-full lg:w-[800px] bg-realm-secondary-950 h-full">
      <RealmNodesTable :nodes="allMy ?? []" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const realmNodeStore = useRealmNodeStore()
const { allMy, loading } = storeToRefs(realmNodeStore)
const route = useRoute()

const realm = ref(route.params.realm as Realm)

await realmNodeStore.getAllMy(realm.value)
</script>

<style></style>
