<template>
  <div class="w-full h-full flex">
    <div v-if="$viewport.isGreaterThan('tablet')" class="grow flex items-end">
      <div class="w-44 h-44 bg-white bg-opacity-5"></div>
    </div>
    <div
      v-else
      class="h-full flex items-center justify-between w-full shrink"
    >
      <div class="h-full w-10 flex items-center justify-center bg-realm-primary-500 hover:bg-realm-primary-400 text-white cursor-pointer" @click="goToNodes">
        <i class="pi pi-chevron-left text-xxs"></i>
      </div>
      <RealmNodeAdminMenuNavButton icon="fa fa-circle-nodes" :label="my?.name ?? ''" :path="path" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { nodeTypes } from '~/shared/types'

const { my } = defineProps<{
  my?: nodeTypes.GetMyRealm
}>()

const realm = useRoute().params.realm as string
const id = useRoute().params.id as string

const goToNodes = () => {
  navigateTo(`/${my?.realm}/node-admin/nodes`)
}

const path = `/${realm}/node-admin/${id}/profile`
</script>

<style></style>
