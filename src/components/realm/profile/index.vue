<template>
  <div class="w-fit h-full">
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
          <div class="flex flex-col justify-center gap-0.5 pb-4 w-full text-center">
            <i class="pi pi-users text-2xl"></i>
            <div class="text-xs text-realm-text-300">Organisation:</div>
            <div class="truncate w-full">{{ my?.organisation?.name }}</div>
            <div class="mt-2 flex flex-col gap-1">
              <Button label="Organisation settings" severity="secondary" icon="pi pi-cog" @click="goToOrganisationAdmin" />
            </div>
          </div>
        </Panel>
        <div class="flex flex-col gap-1">
          <Button label="Open profile" icon="pi pi-user" severity="secondary" />
          <Button label="Node management" severity="secondary" icon="pi pi-cog" @click="goToNodeAdmin" />
          <Button label="Logout" icon="pi pi-sign-out" @click="logout" severity="danger" />
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

const { my } = defineProps<{
  my: userTypes.GetMy
  loading: boolean
}>()

const { $oidc } = useNuxtApp()
const router = useRouter()

const open = ref(false)

const toggle = (event: any) => {
  open.value = !open.value
}

const logout = async () => {
  const realm = my?.realm
  if (realm) await $oidc.logout(realm)
  router.push('/')
}

const goToNodeAdmin = () => {
  const realm = my?.realm
  if (realm) router.push(`/${realm}/node-admin`)
  open.value = false
}

const goToOrganisationAdmin = () => {
  const realm = my?.realm
  if (realm) router.push(`/${realm}/organisation-admin`)
  open.value = false
}

const name = computed(() => `${my?.givenName} ${my?.familyName?.at(0)}.`)
</script>

<style></style>
