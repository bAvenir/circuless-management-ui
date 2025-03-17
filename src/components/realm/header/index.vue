<template>
  <div class="w-full h-14 bg-white shadow-sm flex items-center justify-between">
    <div v-if="$viewport.isGreaterThan('tablet')"></div>
    <div class="flex items-center gap-6 h-full justify-between lg:justify-start w-full lg:w-fit pl-4 lg:pl-0">
      <NuxtLink :to="`/${realm}`">
        <Button :label="`${realmName} dashboard`" size="small" />
      </NuxtLink>
      <RealmProfile realm="circuless" class="text-text" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { toTitleCase } from '~/utils/misc'

const { realm } = defineProps<{
  realm: Realm
}>()

const realmName = computed(() => toTitleCase(realm))
</script>

<style></style>
