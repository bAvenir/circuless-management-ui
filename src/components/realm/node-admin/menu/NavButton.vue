<template>
  <div
    class="w-32 lg:w-44 h-16 lg:h-10 flex flex-col lg:flex-row items-center justify-center lg:justify-start text-white py-2 cursor-pointer"
    :class="{ 'bg-transparent  hover:bg-realm-secondary-900': !active, 'bg-realm-primary-500 ': active }"
  >
    <div class="size-8 flex items-center justify-center text-xs">
      <font-awesome-icon v-if="icon.startsWith('fa')" :icon="icon" />
      <i v-else :class="icon" />
    </div>
    <div class="text-xxs lg:text-xs">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
const { active = false } = defineProps<{
  icon: string
  label: string
  active?: boolean
}>()
</script>

<style></style>
