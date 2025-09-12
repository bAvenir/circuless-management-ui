<template>
  <div class="w-full h-full flex flex-col pl-0 pt-4 lg:pl-16 lg:pt-20 overflow-y-auto">
    <div class="w-full pl-4 pb-4 lg:pl-0 flex items-center justify-between gap-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText type="text" v-model="search" placeholder="Search node..." />
      </IconField>
      <div class="pr-4">
        <Button 
          label="Add Node" 
          icon="pi pi-plus" 
          severity="secondary" 
          :loading="loading" 
          @click="showAddDialog = true"
        />
      </div>
    </div>
    <div v-if="nodes.length > 0" class="w-full grow pb-20">
      <div v-for="node of nodes" class="w-full">
        <div
          class="flex items-center gap-2 justify-between w-full border-b border-whitesmoke border-opacity-10 py-8 hover:bg-realm-secondary-800 cursor-pointer px-4"
          @click="emit('onSelect', node.id)"
        >
          <RealmNodesPreview :node="node" class="text-white" />
          <div class="flex items-center gap-4 shrink-0">
            <Button icon="pi pi-ellipsis-h" text class="text-white" />
            <i class="pi pi-chevron-right text-white"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col text-lg text-white w-full lg:pr-16">No records found</div>

    <!-- Add Node Dialog -->
    <RealmNodesAdd 
      v-model:visible="showAddDialog" 
      @node-added="handleNodeAdded"
      :realm="realm"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client';
import { nodeTypes } from '~/shared/types'

const { nodes, loading } = defineProps<{
  realm: Realm
  nodes: nodeTypes.WithStringDates[]
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete', 'onNodeAdded'])

const search = ref('')
const showAddDialog = ref(false)

const handleNodeAdded = (nodeData: any) => {
  emit('onNodeAdded', nodeData)
}
</script>

<style></style>

<style></style>
