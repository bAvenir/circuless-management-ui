<template>
  <div class="w-full h-full">
    <RealmUserTable
      v-if="my"
      :users="my.users"
      :loading="loading"
      @onSelect="(data) => emit('onSelect', data)"
      @onDelete="(data) => emit('onDelete', data)"
    />
  </div>
</template>

<script lang="ts" setup>
import { organisationTypes } from '~/shared/types'

const props = defineProps<{
  my: organisationTypes.GetMyRealm
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const { my } = toRefs(props)
</script>

<style></style>
