<template>
  <div
    class="w-24 lg:w-44 h-full lg:h-10 flex flex-col lg:flex-row
           items-center justify-center lg:justify-start text-white
           py-2 cursor-pointer transition-colors rounded-md"
    :class="active ? activeClasses : inactiveClasses"
    @click="navigate"
  >
    <div class="size-8 flex items-center justify-center text-xs">
      <font-awesome-icon v-if="icon.startsWith('fa')" :icon="icon" />
      <i v-else :class="icon" />
    </div>

    <div
      v-if="$viewport.isGreaterThan('mobileMedium')"
      class="text-xxs lg:text-xs truncate max-w-12 sm:max-w-max"
    >
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon: string
  label: string
  path: string
}>()

const route = useRoute()

const active = computed(() => route.path.startsWith(props.path))

// ACTIVE STATE — uses your new cyan-glow UI styling
const activeClasses = `
  !bg-cyan-500/10
  !text-cyan-300
  border border-cyan-400/40
  shadow-md shadow-black/20
  hover:!bg-cyan-500/20
`

// INACTIVE STATE — clean subtle hover
const inactiveClasses = `
  bg-transparent
  hover:bg-white/5
`
const navigate = () => navigateTo(props.path)
</script>

<style scoped>
</style>
