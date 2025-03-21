<template>
  <div>
    <Button icon="pi pi-ellipsis-h" severity="secondary" aria-label="Users actions" />
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

defineProps<{
  user: userTypes.GetRealm
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
</script>

<style></style>
