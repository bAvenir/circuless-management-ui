<template>
  <div class="w-full h-full flex flex-col relative">
    <RealmHeader :my="my" :loading="loading" class="absolute top-0 left-0 w-full z-50" />
    <div class="w-full grow bg-whitesmoke bg-opacity-20 pt-14 overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Realm } from '@prisma/client'
import { useRealmUserStore } from '~/stores/realm/user'

definePageMeta({
  middleware: [
    'realm-auth',
    function (to, from) {
      const realm = to.params.realm as Realm
      const path = `/${realm}/node-admin`
      if (to.path === path) {
        return navigateTo(`${path}/nodes`)
      }
    },
  ],
})

const realmUserStore = useRealmUserStore()
const route = useRoute()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmUserStore)

await realmUserStore.getMy(realm.value)
</script>
