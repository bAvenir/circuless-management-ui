<template>
  <div class="w-full h-full flex flex-col">
    <CirculessHeader />
    <div class="w-full grow">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['realm-auth'],
})
</script>
