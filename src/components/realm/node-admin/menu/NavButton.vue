<template>
  <div
    class="w-24 lg:w-44 h-full lg:h-10 flex flex-col lg:flex-row items-center justify-center lg:justify-start text-white py-2 cursor-pointer"
    :class="{ 'bg-transparent  hover:bg-realm-secondary-900 transition-colors': !active, 'bg-realm-primary-500 ': active }"
    @click="navigate"
  >
    <div class="size-8 flex items-center justify-center text-xs">
      <font-awesome-icon v-if="icon.startsWith('fa')" :icon="icon" />
      <i v-else :class="icon" />
    </div>
    <div v-if="$viewport.isGreaterThan('mobileMedium')" class="text-xxs lg:text-xs truncate max-w-12 sm:max-w-max">{{ label }}</div>
  </div>
</template>

<script lang="ts" setup>
const { icon, label, path } = defineProps<{
  icon: string
  label: string
  path: string
}>()

const route = useRoute()

const active = computed(() => {
  return route.path.startsWith(path)
})

const navigate = () => {
  navigateTo(path)
}
</script>

<style></style>
