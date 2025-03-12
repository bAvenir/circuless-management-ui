<template>
  <div class="flex items-center gap-2 text-sm w-fit h-full cursor-pointer bg-transparent hover:bg-slate-100 transition-colors px-4">
    <i class="pi pi-user"></i>
    <div>{{ name }}</div>
    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
    <i v-else class="pi pi-chevron-down"></i>
  </div>
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

const { my, loading } = storeToRefs(realmUserStore)

await realmUserStore.init(realm)

const logout = async () => {
  await $oidc.logout(realm)
  router.push('/')
}

const name = computed(() => `${my.value?.givenName} ${my.value?.familyName?.at(0)}.`)
</script>

<style></style>
