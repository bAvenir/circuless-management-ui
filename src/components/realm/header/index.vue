<template>
  <div class="w-full h-14 bg-white shadow-sm flex items-center justify-between">
    <div v-if="$viewport.isGreaterThan('tablet')"></div>
    <div class="flex items-center gap-3 h-full justify-between lg:justify-start w-full lg:w-fit pl-4 lg:pl-0">
      <NuxtLink v-if="my?.realm" :to="`/${my.realm}`">
      <Button  :label="`${realmName} dashboard`"  severity="secondary" size="small" />
      </NuxtLink>
      <RealmProfile :my="my" :loading="loading" class="text-text" />

    </div>
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'
import { toTitleCase } from '~/utils/misc'

const { my, loading } = defineProps<{
  my: userTypes.GetMy
  loading: boolean
}>()

const realmName = computed(() => toTitleCase(my?.realm ?? 'no realm'))
</script>

<style></style>
