<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="w-full h-full flex">
    <RealmNodeAdminMenu />
    <div class="grow h-full p-4 bg-realm-primary-100">
      {{ my?.name }}
    </div>
  </div>
  <div v-else class="w-full h-full flex flex-col">
    <div class="grow w-full p-4 bg-realm-primary-100">
      {{ my?.name }}
    </div>
    <RealmNodeAdminMenu />
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const realmNodeStore = useRealmNodeStore()
const { my, loading } = storeToRefs(realmNodeStore)
const route = useRoute()

const realm = ref(route.params.realm as Realm)
const id = ref(route.params.id as string)

await realmNodeStore.getMy(id.value, realm.value)
</script>

<style></style>
