<template>
  <div class="w-full h-full lg:flex lg:flex-col">
    <CirculessHeader :my="my" :loading="loading" class="fixed lg:inherit top-0 left-0 w-full z-50" />
    <div class="w-full lg:grow bg-whitesmoke bg-opacity-20 pt-14 lg:overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRealmUserStore } from '~/stores/realm/user'

definePageMeta({
  middleware: ['circuless-auth'],
  redirect: '/circuless/marketplace',
})

const realmUserStore = useRealmUserStore()
const { my, loading } = storeToRefs(realmUserStore)

await callOnce(async () => {
  await realmUserStore.getMy('circuless')
})
</script>
