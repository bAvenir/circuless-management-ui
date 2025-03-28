<template>
  <div class="w-full py-5 px-4 flex items-center gap-4">
    <div class="size-6 bg-lightBrown text-white rounded-md flex items-center justify-center text-xs">
      <font-awesome-icon icon="fa fa-cube" />
    </div>
    <div class="grow flex flex-col gap-1">
      <div class="font-semibold text-sm text-realm-text-600">{{ item?.title }}</div>
      <div class="text-xs text-realm-text-300">{{ item?.['@type']?.at(0) }}</div>
    </div>
    <div class="text-xs text-realm-text-300">{{ item?.properties?.length ?? 0 }} properties</div>
  </div>
</template>

<script lang="ts" setup>
import type { ItemTD } from '@bavenir/spade-node-js-client'

const { item } = defineProps<{
  item?: ItemTD
}>()
</script>

<style></style>
