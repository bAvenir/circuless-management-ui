<template>
  <div class="flex items-center gap-4">

    <!-- Icon -->
    <div class="size-8 flex items-center justify-center rounded-lg
                bg-cyan-600/20 border border-cyan-500/30 shadow-cyan-500/20 shadow-md">
      <font-awesome-icon icon="fa fa-circle-nodes" class="text-cyan-300 text-base" />
    </div>

    <!-- Text -->
    <div class="flex flex-col">
      <div class="text-white font-medium text-base">{{ node.name }}</div>
      <div class="text-sm text-white/60">{{ node.host }}</div>

      <div class="text-xs mt-2 flex items-center gap-1 text-white/50">
        <span class="text-white/40">version:</span>
        <span class="text-white/60">{{ node.version ?? "—" }}</span>
        <span class="text-white/40">(created: {{ $formatDate(node.createdAt) }})</span>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const { node } = defineProps<{ node: any }>()
</script>
