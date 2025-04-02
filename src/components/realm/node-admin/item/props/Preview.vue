<template>
  <div class="w-full py-5 px-4 flex items-center gap-4 max-w-[48rem]">
    <div class="grow flex flex-col gap-4">
      <div class="font-semibold text-realm-text-600">{{ property?.title }}</div>
      <div class="text-sm text-realm-text-300 flex flex-col gap-0.5">
        <div class="flex items-center gap-1">
          <div>Type:</div>
          <div>-</div>
        </div>
        <div class="flex items-center gap-1">
          <div>Data units:</div>
          <div>-</div>
        </div>
        <div class="flex items-center gap-1">
          <div>Data type:</div>
          <div>-</div>
        </div>
      </div>
      <div class="text-sm text-realm-text-300 flex flex-col gap-0.5">
        <div>Description:</div>
        <div>-</div>
      </div>
    </div>
    <Button severity="secondary" size="small">
      <div class="font-medium">Connections</div>
      <i class="pi pi-chevron-right text-xs" />
    </Button>
  </div>
</template>

<script lang="ts" setup>
import type { PropertyTD } from '@bavenir/spade-node-js-client'

const { property } = defineProps<{
  property?: PropertyTD
}>()
</script>

<style></style>
