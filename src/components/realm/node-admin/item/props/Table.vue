<template>
  <div v-if="item?.td?.properties" class="w-full">
    <div v-for="(value, key) in item?.td?.properties" :key="key" :id="key.toString()" class="border-b border-slate-200" @click="emit('onSelect', key)">
      <RealmNodeAdminItemPropsPreview :property="value" />
    </div>
  </div>
  <div v-else>
    <div class="flex items-center justify-center w-full h-14">
      <p class="text-slate-500">No properties available</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ThingDescription } from '~/api/realm/td';

defineProps<{
  item?: ThingDescription
}>()

const emit = defineEmits(['onSelect', 'onDelete'])
</script>

<style></style>
