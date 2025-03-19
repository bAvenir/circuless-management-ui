<template>
  <div class="w-full h-full">
    <Button v-if="$viewport.isGreaterThan('tablet')" class="w-full" severity="secondary" size="small" :variant="active ? undefined : 'text'">
      <div class="flex items-center justify-start gap-2 w-full text-sm font-medium">
        <i v-if="icon.startsWith('pi')" :class="icon"></i>
        <font-awesome-icon v-if="icon.startsWith('fa')" :icon="icon"></font-awesome-icon>
        <div>{{ label }}</div>
      </div>
    </Button>
    <div v-else class="flex items-center justify-start gap-2 w-full font-medium py-4 border-b border-realm-text-100 hover:bg-whitesmoke px-4">
      <i v-if="icon.startsWith('pi')" :class="icon"></i>
      <font-awesome-icon v-if="icon.startsWith('fa')" :icon="icon"></font-awesome-icon>
      <div class="grow">{{ label }}</div>
      <i class="pi pi-chevron-right"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { active, icon, label } = defineProps<{
  active: boolean
  icon: string
  label: string
}>()
</script>

<style></style>
