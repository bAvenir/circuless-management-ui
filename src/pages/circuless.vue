<template>
  <div class="w-full h-full flex flex-col">
    <CirculessHeader :my="my" :loading="loading" />
    <div class="w-full grow">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Realm } from '@prisma/client'
import { useRealmUserStore } from '~/stores/realm/user'

definePageMeta({
  middleware: ['circuless-auth'],
  redirect: '/circuless',
})

const realmUserStore = useRealmUserStore()
const { my, loading } = storeToRefs(realmUserStore)

await callOnce(async () => {
  await realmUserStore.getMy('circuless' as Realm)
})
</script>
