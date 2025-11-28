<template>
  <div class="w-full h-full flex">
    <div v-if="$viewport.isGreaterThan('tablet')" class="grow flex items-end">
      <div class="w-44 h-44 bg-white bg-opacity-5 flex flex-col">
        <div class="w-full h-10 flex items-center group text-white cursor-pointer" @click="goToNodes">
          <div
            class="size-10 flex items-center justify-center bg-realm-primary-500 group-hover:bg-realm-primary-400 text-white cursor-pointer transition-colors shrink-0"
          >
            <i class="pi pi-chevron-left text-xxs"></i>
          </div>
          <div class="flex items-center gap-2 group-hover:bg-realm-secondary-900 transition-colors w-full h-full pl-3 grow">
            <font-awesome-icon icon="fa fa-circle-nodes" class="text-xs" />
            <div class="text-xs truncate max-w-24">{{ my?.name }}</div>
          </div>
        </div>
        <div
          class="w-full grow hover:bg-realm-secondary-900 transition-colors cursor-pointer flex flex-col items-center justify-center gap-6"
          @click="profileVisible = true"
        >
          <div class="w-8 h-0.5 bg-slate-500"></div>
          <div class="text-xxs flex flex-col items-center gap-1">
            <div class="text-slate-400 tracking-tight">Connected to organisation:</div>
            <div class="flex items-center gap-1 text-white">
              <font-awesome-icon icon="fa fa-users" />
              <div class="text-xs truncate max-w-24">{{ my?.owner.name }}</div>
            </div>
          </div>
          <div class="flex items-center gap-1 text-realm-primary-500 font-semibold">
            <div class="text-xxs">Show more</div>
            <i class="pi pi-chevron-down text-xxs"></i>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-full flex items-center justify-between w-full shrink">
      <div
        class="h-full w-10 flex items-center justify-center bg-realm-primary-500 hover:bg-realm-primary-400 text-white cursor-pointer"
        @click="goToNodes"
      >
        <i class="pi pi-chevron-left text-xxs"></i>
      </div>
      <RealmNodeAdminMenuNavButton icon="fa fa-circle-nodes" :label="my?.name ?? ''" :path="path" />
    </div>
    <Drawer v-model:visible="profileVisible" header=" " position="bottom" style="height: 30rem" :pt="{'header': 'pb-0'}">
      <RealmNodeAdminNode :my="my" />
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import type { nodeTypes } from '~/shared/types'

const { my } = defineProps<{
  my?: nodeTypes.GetMyRealm
}>()

const realm = useRoute().params.realm as string
const id = useRoute().params.id as string

const profileVisible = ref(false)

const goToNodes = () => {
  navigateTo(`/${my?.realm}/node-admin`)
}

const path = `/${realm}/node-admin/${id}/profile`
</script>

<style></style>
