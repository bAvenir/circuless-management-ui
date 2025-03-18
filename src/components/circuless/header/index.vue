<template>
  <div class="w-full h-14 bg-circuless-lightGreen flex items-center justify-between">
    <CirculessHeaderLogo class="pl-4" />
    <div class="flex items-center gap-3 h-full">
      <NuxtLink v-if="$viewport.isGreaterThan('tablet')" to="/circuless/node-admin">
        <Button label="Node management" icon="pi pi-cog"  severity="secondary" size="small" />
      </NuxtLink>
      <RealmProfile realm="circuless" class=" text-text" />
    </div>
  </div>
</template>

<script lang="ts" setup>
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
