<template>
  <div class="flex items-center gap-2">
    <font-awesome-icon v-if="metaData.icon.startsWith('fa')" :icon="metaData.icon" />
    <div v-else :class="metaData.icon"></div>
    <div v-if="metaData.title">{{ metaData.title }}</div>
    <div v-else>Unknown</div>
  </div>
</template>

<script lang="ts" setup>
import type { FetchThingDescription } from '~/api/realm/td';
import { getItemMetaData } from '~/utils'

const { item } = defineProps<{
  item?: FetchThingDescription
}>()

const metaData = getItemMetaData(item)
</script>

<style></style>
