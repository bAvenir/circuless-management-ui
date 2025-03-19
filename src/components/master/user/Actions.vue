<template>
  <div></div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

defineProps<{
  user: userTypes.GetMaster
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
</script>

<style></style>
