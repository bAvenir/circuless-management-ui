<template>
  <div class="flex flex-col items-center gap-0.5 w-full text-center">
    <i class="pi pi-users text-2xl"></i>
    <div class="text-xs text-realm-text-300">Organisation:</div>
    <div class="truncate w-full">{{ organisation?.name ?? '--' }}</div>
  </div>
</template>

<script lang="ts" setup>
import { organisationTypes } from '~/shared/types'

const { organisation, loading } = defineProps<{
  organisation?: organisationTypes.GetMyRealm | null
  loading: boolean
}>()
</script>

<style></style>
