<template>
  <div>
    {{ my?.name }}
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
