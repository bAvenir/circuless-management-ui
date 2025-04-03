<template>
  <div class="w-full py-5 px-5 flex items-center gap-4 max-w-[48rem]">
    <div class="grow flex flex-col gap-1">
      <div class="font-semibold text-realm-text-600">{{ property?.title }}</div>
    </div>
    <Button label="Connections" severity="secondary" icon="pi pi-chevron-right" iconPos="right" size="small" />
  </div>
</template>

<script lang="ts" setup>
import type { PropertyTD } from '@bavenir/spade-node-js-client'

const { property } = defineProps<{
  property?: PropertyTD
}>()
</script>

<style></style>
