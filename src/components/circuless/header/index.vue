<template>
  <div class="w-full h-14 px-6 py-3 bg-gradient-to-r bg-cyan-100/70 border-b border-cyan-200 flex items-center justify-between">
    <CirculessHeaderLogo class="pl-4" />
    <div class="flex items-center gap-10 h-full">
      <div class="flex items-center justify-end gap-5">
        <NuxtLink v-if="$viewport.isGreaterThan('tablet')" to="/circuless/node-admin">
          <Button label="Node Management" icon="pi pi-cog" severity="secondary" size="small" />
        </NuxtLink>
      </div>
      <RealmProfile :my="my" :loading="loading" class="text-text" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

const { my, loading } = defineProps<{
  my: userTypes.GetMy
  loading: boolean
}>()

const { $oidc } = useNuxtApp()
const router = useRouter()

const logout = async () => {
  await $oidc.logout('circuless')
  router.push('/')
}

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Users',
    icon: 'pi pi-user',
    route: '/circuless/users',
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: logout,
  },
])
</script>

<style></style>
