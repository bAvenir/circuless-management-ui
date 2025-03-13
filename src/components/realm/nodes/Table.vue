<template>
  <div class="w-full h-full flex flex-col pl-0 pt-4 lg:pl-16 lg:pt-20">
    <div class="w-fit pl-4 lg:pl-0">
      <div class="pb-4">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText type="text" v-model="search" placeholder="Search node..." />
        </IconField>
      </div>
    </div>
    <div class="w-full grow overflow-y-auto pb-20">
      <div v-for="node of nodes" class="w-full">
        <div
          class="flex items-center gap-2 justify-between w-full border-b border-whitesmoke border-opacity-20 py-8 hover:bg-realm-secondary-800 cursor-pointer px-4"
        >
          <RealmNodesPreview :node="node" class="text-white" />
          <div class="flex items-center gap-4 shrink-0">
            <Button icon="pi pi-ellipsis-h" text class="text-white" />
            <i class="pi pi-chevron-right text-white"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nodeTypes } from '~/shared/types'

const { nodes, loading } = defineProps<{
  nodes: nodeTypes.WithStringDates[]
  loading: boolean
}>()

const search = ref('')
</script>

<style></style>
