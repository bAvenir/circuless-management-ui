<template>
  <div class="w-full">
    <div v-for="node of nodes" class="w-full pl-0 lg:pl-16">
      <div class="flex items-center gap-2 justify-between w-full border-b border-whitesmoke border-opacity-20 py-8 hover:bg-realm-secondary-800 cursor-pointer px-4">
        <RealmNodesPreview :node="node" class="text-white" />
        <div class="flex items-center gap-4 shrink-0">
          <Button icon="pi pi-ellipsis-h" text class="text-white"  />
          <i class="pi pi-chevron-right text-white"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nodeTypes } from '~/shared/types'

const { nodes, loading } = defineProps<{
  nodes: nodeTypes.WithNoDates[]
  loading: boolean
}>()
</script>

<style></style>
