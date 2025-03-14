<template>
  <div class="w-full h-full flex flex-col relative">
    <RealmHeader :realm="realm" class="absolute top-0 left-0 w-full" />
    <div class="w-full grow bg-whitesmoke bg-opacity-20 pt-14 overflow-y-auto">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Realm } from '@prisma/client'

definePageMeta({
  middleware: [
    'realm-auth',
  ],
})

const route = useRoute()

const realm = ref(route.params.realm as Realm)
</script>
