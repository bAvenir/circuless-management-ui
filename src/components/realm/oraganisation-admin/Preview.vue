<template>
  <div class="text-realm-text-300 lg:text-sm font-medium flex items-center gap-2 px-4 lg:px-0">
    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
    <i v-else class="pi pi-users"></i>
    <div>
      {{ organisation?.name ?? '--' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { organisationTypes } from '~/shared/types'

const { organisation, loading } = defineProps<{
  organisation?: organisationTypes.GetMyRealm
  loading: boolean
}>()
</script>

<style></style>
