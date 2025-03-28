<template>
  <div class="w-full h-full flex flex-col-reverse lg:flex-row">
    <RealmNodeAdminMenu :my="my" />
    <div v-if="$viewport.isGreaterThan('tablet')" class="grow h-full p-4 bg-realm-primary-100 flex flex-col overflow-x-hidden">
      <Panel #default class="grow w-full no-header-panel pt-4 grow-panel-content">
        <NuxtPage />
      </Panel>
    </div>
    <div v-else class="grow h-full bg-white overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

definePageMeta({
  middleware: [
    function (to, from) {
      const realm = to.params.realm as Realm
      const id = to.params.id as string
      const path = `/${realm}/node-admin/${id}`
      if (to.path === path) {
        return navigateTo(`${path}/items`)
      }
    },
  ],
})

const realmNodeStore = useRealmNodeStore()
const { my, loading } = storeToRefs(realmNodeStore)
const route = useRoute()

const realm = ref(route.params.realm as Realm)
const id = ref(route.params.id as string)

await realmNodeStore.getMy(id.value, realm.value)
</script>

<style></style>
