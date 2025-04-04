<template>
  <div class="flex flex-col gap-6">
    <div class="text-xl font-medium leading-none border-b border-slate-200 px-4 lg:px-0 pb-4 pt-4 lg:pt-0">
      <div class="flex items-center gap-2 h-[2.625rem]">
        <i class="pi pi-circle-fill text-success"></i>
        <div>{{ my?.name }} online</div>
      </div>
    </div>
    <div class="flex flex-col gap-1 px-4 lg:px-0">
      <div class="text-sm text-realm-text-300">Connected to organisation</div>
      <div class="font-semibold text-sm text-realm-text-600 flex items-center gap-2">
        <i class="pi pi-users"></i>
        <div>{{ my?.owner?.name }}</div>
      </div>
    </div>
    <div class="flex flex-col gap-1 px-4 lg:px-0">
      <div class="text-sm text-realm-text-300">Node domain</div>
      <div
        class="font-semibold text-sm text-realm-text-600 flex items-center gap-2 group cursor-pointer w-fit"
        @click="openNodeUrl"
      >
        <i class="pi pi-globe"></i>
        <div class="group-hover:underline">{{ my?.host }}</div>
        <i class="pi pi-external-link text-xs"></i>
      </div>
    </div>
    <div class="flex flex-col gap-1 px-4 lg:px-0">
      <div class="text-sm text-realm-text-300">Image version</div>
      <div class="font-semibold text-sm text-realm-text-600 flex items-center gap-2">
        <font-awesome-icon icon="fa-brands fa-docker" />
        <div>{{ my?.version }}</div>
      </div>
      <div class="text-sm text-realm-text-300">created at: {{ my?.createdAt }}</div>
    </div>
    <div class="flex flex-col gap-1 px-4 lg:px-0">
      <div class="text-sm text-realm-text-300">Node ID</div>
      <div class="font-semibold text-sm text-realm-text-600">{{ my?.id }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { nodeTypes } from '~/shared/types'

const { my } = defineProps<{ my?: nodeTypes.GetMyRealm }>()

const openNodeUrl = () => {
  window.open(`https://${my?.host}`, '_blank')
}
</script>

<style></style>
