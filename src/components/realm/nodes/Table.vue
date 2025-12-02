<template>
  <div
    class="w-full h-full flex flex-col overflow-y-auto
           bg-gradient-to-b from-[#0e1523] via-[#16112e] to-[#05060a]"
  >
    <!-- Sticky toolbar -->
    <div
      class="sticky top-0 z-30 w-full px-4 lg:px-16 py-4
             bg-[#0e1523]/70 backdrop-blur-xl border-b border-white/10"
    >
      <div class="flex items-center gap-4 justify-between">

        <!-- Search -->
        <IconField class="flex-1 max-w-[520px]">
          <InputIcon class="pi pi-search text-white/40" />
          <InputText
            v-model="search"
            type="text"
            placeholder="Search node…"
            class="w-full !bg-white/5 !border-white/10 !text-white
                   placeholder:text-white/40 focus:!border-cyan-400/70
                   rounded-lg shadow-md shadow-black/20"
          />
        </IconField>

        <!-- Actions -->
        <Button
          label="Add Node"
          icon="pi pi-plus"
          severity="secondary"
          :loading="props.loading"
          class="!bg-cyan-500/10 hover:!bg-cyan-500/20 !text-cyan-300
                 !border !border-cyan-400/40 rounded-lg shadow-md shadow-black/20"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <!-- List header -->
    <div class="px-4 lg:px-16 pt-6 pb-2 text-xs uppercase tracking-wide text-white/40">
      <span class="inline-flex items-center gap-2">
        <span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
        Nodes
        <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 ml-1">
          {{ props.nodes.length }}
        </span>
      </span>
    </div>

    <!-- Nodes -->
    <div v-if="filtered.length > 0" class="w-full grow pb-24">
      <div v-for="node of filtered" :key="node.id" class="px-4 lg:px-16">

        <div
          class="group relative my-5 rounded-xl border border-white/10
                 bg-white/[0.03] hover:bg-white/[0.06]
                 transition-all duration-200
                 shadow-lg shadow-black/30"
        >
          <!-- Click layer -->
          <button
            class="absolute inset-0"
            @click="emit('onSelect', node.id)"
            aria-label="Open node"
          />

          <!-- Row content -->
          <div class="flex items-center justify-between gap-4 px-4 lg:px-6 py-5">
            <RealmNodesPreview :node="node" class="text-white" />

            <div class="flex items-center gap-3 shrink-0">
              <Button
                icon="pi pi-ellipsis-h"
                text
                class="!text-white/50 hover:!bg-white/10 rounded-md"
              />
              <i class="pi pi-chevron-right text-white/40 group-hover:text-white"></i>
            </div>
          </div>

          <!-- Cyan Neon Bottom Border -->
          <div
            class="pointer-events-none absolute inset-x-0 -bottom-px h-[2px]
                   bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity"
          ></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else
      class="flex flex-col items-center justify-center text-white/60 py-20"
    >
      <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-10 max-w-lg text-center">
        <div class="mx-auto mb-4 h-12 w-12 rounded-full bg-white/5 grid place-items-center">
          <i class="pi pi-search text-white/50"></i>
        </div>
        <p class="text-lg">No records found</p>
        <p class="text-sm text-white/40 mt-1">Try a different query or add a new node.</p>

        <Button
          label="Add Node"
          icon="pi pi-plus"
          class="mt-6 !bg-cyan-500/10 hover:!bg-cyan-500/20 !text-cyan-300
                 !border !border-cyan-400/40 rounded-lg"
          @click="showAddDialog = true"
        />
      </div>
    </div>

    <!-- Add Node Dialog -->
    <RealmNodesAdd
      v-model:visible="showAddDialog"
      @node-added="handleNodeAdded"
      :realm="props.realm"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'

const props = defineProps<{
  realm: Realm
  nodes: any[]
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onNodeAdded'])

const search = ref('')
const showAddDialog = ref(false)

const handleNodeAdded = (nodeData: any) => emit('onNodeAdded', nodeData)

const nodesRef = toRef(props, 'nodes')
const { filtered } = useNodeFilter(nodesRef, search)
</script>
