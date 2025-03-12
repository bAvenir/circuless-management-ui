<template>
  <div class="w-full h-16 bg-circulessLightGreen flex items-center justify-between">
    <CirculessHeaderLogo class="pl-4" />
    <div class="flex items-center gap-6 h-full">
      <Button label="Administration" severity="secondary" size="small" />
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
    route: '/circuless/circuless/users',
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: logout,
  },
])
</script>

<style></style>
