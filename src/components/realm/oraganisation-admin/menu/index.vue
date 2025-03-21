<template>
  <div class="w-full h-full overflow-y-auto">
    <div class="w-full pb-8 lg:pb-4">
      <div class="text-xs text-realm-text-300 w-full pb-2 px-4 lg:px-0">General</div>
      <NuxtLink v-for="item in general" :to="item.path" :key="item.path">
        <RealmOraganisationAdminMenuNavButton :active="route.path === item.path" :icon="item.icon" :label="item.label" />
      </NuxtLink>
    </div>
    <div class="w-full pb-8 lg:pb-4">
      <div class="text-xs text-realm-text-300 w-full pb-2 px-4 lg:px-0">Management</div>
      <NuxtLink v-for="item in management" :to="item.path" :key="item.path">
        <RealmOraganisationAdminMenuNavButton :active="route.path === item.path" :icon="item.icon" :label="item.label" />
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'

const { realm } = defineProps<{
  realm: Realm
}>()

const route = useRoute()

const general = [
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    path: `/${realm}/organisation-admin/section/settings`,
  },
  {
    label: 'Audit trails',
    icon: 'pi pi-clipboard',
    path: `/${realm}/organisation-admin/section/audit-trails`,
  },
]

const management = [
  {
    label: 'Users',
    icon: 'pi pi-user',
    path: `/${realm}/organisation-admin/section/users`,
  },
  {
    label: 'Invitations',
    icon: 'pi pi-send',
    path: `/${realm}/organisation-admin/section/invitations`,
  },
  {
    label: 'Partnerships',
    icon: 'fa-regular fa-handshake',
    path: `/${realm}/organisation-admin/section/partnerships`,
  },
]
</script>

<style></style>
