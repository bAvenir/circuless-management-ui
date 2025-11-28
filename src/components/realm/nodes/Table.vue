<template>
  <div class="w-full h-full flex flex-col overflow-y-auto">
    <!-- Sticky toolbar -->
    <div
      class="sticky top-0 z-30 w-full px-4 lg:px-16 py-3 lg:py-5
             bg-[#0e1523]/70 backdrop-blur-md border-b border-white/10"
    >
      <div class="flex items-center gap-3 lg:gap-4 justify-between">
        <!-- Search -->
        <IconField class="flex-1 max-w-[520px]">
          <InputIcon class="pi pi-search text-white/50" />
          <InputText
            type="text"
            v-model="search"
            placeholder="Search node…"
            class="w-full !bg-white/5 !border-white/10 !text-white
                   placeholder:text-white/40 focus:!border-cyan-400/60
                   rounded-lg"
          />
        </IconField>

        <!-- Actions -->
        <div class="flex items-center gap-2 pr-1 lg:pr-0">
          <Button
            label="Add Node"
            icon="pi pi-plus"
            severity="secondary"
            :loading="loading"
            class="!bg-cyan-500/10 hover:!bg-cyan-500/20 !text-cyan-300
                   !border !border-cyan-500/30 rounded-lg shadow-none"
            @click="showAddDialog = true"
          />
        </div>
      </div>
    </div>

    <!-- List header -->
    <div class="px-4 lg:px-16 pt-4 pb-2 text-xs tracking-wide text-white/50">
      <span class="inline-flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400/70"></span>
        Nodes
        <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
          {{ nodes.length }}
        </span>
      </span>
    </div>

    <!-- Nodes -->
    <div v-if="nodes.length > 0" class="w-full grow pb-24">
      <div v-for="node of nodes" :key="node.id" class="px-4 lg:px-16">
        <div
          class="group relative my-2 rounded-xl border border-white/10
                 bg-white/[0.03] hover:bg-white/[0.06]
                 transition-colors duration-200
                 overflow-hidden"
        >
          <!-- Click layer -->
          <button
            type="button"
            class="absolute inset-0"
            @click="emit('onSelect', node.id)"
            aria-label="Open node"
          />
          <!-- Row content -->
          <div class="flex items-center justify-between gap-4 px-4 lg:px-6 py-5">
            <RealmNodesPreview :node="node" class="text-white" />

            <div class="flex items-center gap-2 shrink-0">
              <Button
                icon="pi pi-ellipsis-h"
                text
                class="!text-white/80 hover:!bg-white/10 rounded-md"
              />
              <i class="pi pi-chevron-right text-white/70 group-hover:text-white"></i>
            </div>
          </div>

          <!-- Subtle bottom glow on hover -->
          <div class="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-4 text-white/70
             px-4 lg:px-16 py-16"
    >
      <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-8 w-full max-w-xl text-center">
        <div class="mx-auto mb-3 h-12 w-12 rounded-full bg-white/5 grid place-items-center">
          <i class="pi pi-search text-white/60"></i>
        </div>
        <p class="text-lg">No records found</p>
        <p class="text-sm text-white/50 mt-1">Try a different query or add a new node.</p>
        <Button
          label="Add Node"
          icon="pi pi-plus"
          severity="secondary"
          :loading="loading"
          class="mt-6 !bg-cyan-500/10 hover:!bg-cyan-500/20 !text-cyan-300
                 !border !border-cyan-500/30 rounded-lg shadow-none"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <!-- Add Node Dialog (unchanged) -->
    <RealmNodesAdd
      v-model:visible="showAddDialog"
      @node-added="handleNodeAdded"
      :realm="realm"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
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

<style scoped>
/* Optional: fine-tune scrollbar for the list area */
:global(.ps)::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
:global(.ps)::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
}
</style>
