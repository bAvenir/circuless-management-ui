<template>
  <div>
    <h2>{{ props.error?.statusCode }}</h2>
    <p>{{ props.error?.message }}</p>
    <pre>{{ props.error?.stack }}</pre>
    <pre>{{ props.error }}</pre>
    <Button @click="handleError">Clear errors</Button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>
