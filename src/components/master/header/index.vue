<template>
  <div class="w-full flex items-center justify-center gap-6">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <NuxtLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </NuxtLink>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>
    </Menubar>
  </div>
</template>

<script lang="ts" setup>
const { $oidc } = useNuxtApp()
const router = useRouter()

const logout = async () => {
  await $oidc.logout('master')
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
    route: '/master/users',
  },
  {
    label: 'Organisations',
    icon: 'pi pi-users',
    route: '/master/organisations',
  },
  {
    label: 'Nodes',
    icon: 'pi pi-server',
    route: '/master/nodes',
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: logout,
  },
])
</script>

<style></style>
