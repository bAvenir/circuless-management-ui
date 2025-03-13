<template>
  <div class="flex items-center gap-2 text-sm w-fit h-full cursor-pointer bg-transparent hover:bg-slate-100 transition-colors px-4" @click="toggle">
    <i class="pi pi-user"></i>
    <div>{{ name }}</div>
    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
    <i v-else class="pi pi-chevron-down"></i>
  </div>
  <Drawer v-model:visible="open" position="right">
    <div class="w-full flex flex-col justify-center gap-8 text-center">
      <div class="flex flex-col justify-center gap-0.5">
        <div class="text-xs text-realm-text-300 pb-4">Logged in as:</div>
        <div>{{ my?.givenName }} {{ my?.familyName }}</div>
        <div class="text-xs">{{ my?.email }}</div>
      </div>
      <Panel>
        <div class="flex flex-col justify-center gap-0.5 pb-4">
          <i class="pi pi-users text-2xl"></i>
          <div class="text-xs text-realm-text-300">Organisation:</div>
          <div>{{ my?.organisation?.name }}</div>
          <div class="mt-2">
            <Button label="Manage organisation" icon="pi pi-cog" severity="secondary" />
          </div>
        </div>
      </Panel>
      <div class="flex flex-col gap-1 mt-2">
        <Button label="Open profile" icon="pi pi-user" severity="secondary" />
        <Button label="Logout" icon="pi pi-sign-out" @click="logout" severity="danger" />
      </div>
    </div>
  </Drawer>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmUserStore } from '~/stores/realm/user'

const { realm } = defineProps<{
  realm: Realm
}>()

const { $oidc } = useNuxtApp()
const router = useRouter()
const realmUserStore = useRealmUserStore()

const open = ref(false)
const { my, loading } = storeToRefs(realmUserStore)

await realmUserStore.getMy(realm)

const toggle = (event: any) => {
  open.value = !open.value
}

const logout = async () => {
  await $oidc.logout(realm)
  router.push('/')
}

const name = computed(() => `${my.value?.givenName} ${my.value?.familyName?.at(0)}.`)
</script>

<style></style>
