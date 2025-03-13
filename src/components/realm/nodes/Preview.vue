<template>
  <div class="flex items-center gap-4">
    <div class="size-6 flex items-center justify-center rounded-md bg-realm-primary-500">
      <font-awesome-icon icon="fa fa-circle-nodes" class="text-sm" />
    </div>
    <div class="flex flex-col leading-none">
      <div>{{ node.name }}</div>
      <div class="text-xs mt-1">{{ node.host }}</div>
      <div class="text-xs mt-3 flex items-center gap-1">
        <div class="text-realm-text-300">version:</div>
        <div>{{ node.version }}</div>
        <div>(created: {{ $formatDate(node.createdAt) }})</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { nodeTypes } from '~/shared/types'

const { node } = defineProps<{
  node: nodeTypes.WithStringDates
}>()
</script>

<style></style>
