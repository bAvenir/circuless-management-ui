<template>
  <div class="w-full h-full container mx-auto p-4 flex flex-col">
    <MasterHeader />
    <div class="grow w-full py-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['master-auth'],
})
</script>
