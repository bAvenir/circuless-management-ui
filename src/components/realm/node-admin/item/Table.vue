<template>
  <div class="h-full w-full flex flex-col">
    <div class="pb-4 border-b border-slate-200 flex items-center gap-2 px-4 lg:px-0">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText type="text" v-model="search" placeholder="Search item..." />
      </IconField>
    </div>
    <div class="lg:grow w-full lg:overflow-y-auto">
      <div v-for="item in items" :key="item.id" class="border-b border-slate-200 cursor-pointer hover:bg-realm-primary-100 transition-colors">
        <RealmNodeAdminItemPreview :item="item" @click="emit('onSelect', item.id)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ItemTD } from '@bavenir/spade-node-js-client'

const { items } = defineProps<{
  items?: ItemTD[]
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const search = ref('')
</script>

<style></style>
