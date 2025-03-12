<template>
  <div class="w-full h-full flex items-center justify-between">
    <div v-if="$viewport.isGreaterThan('tablet')"></div>
    <div class="w-full lg:w-[600px] bg-realm-secondary-900 h-full">
      <RealmNodesTable :nodes="allMy ?? []" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client';
import { useRealmNodeStore } from '~/stores/realm/node';

const realmNodeStore = useRealmNodeStore()
const { allMy, loading } = storeToRefs(realmNodeStore)
const route = useRoute()

const realm = ref(route.params.realm as Realm)

realmNodeStore.init(realm.value)
await realmNodeStore.getAllMy()

</script>

<style>

</style>