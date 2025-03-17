<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="w-full h-full px-4">
    <div class="py-4 h-full flex items-center justify-between gap-4">
      <Panel class="h-full w-56">
        <template #header>
          <RealmOraganisationAdminPreview :organisation="my?.organisation" :loading="loading" />
        </template>
        <RealmOraganisationAdminMenu :realm="realm" />
      </Panel>
      <div class="h-full grow">
        <NuxtPage />
      </div>
    </div>
  </div>
  <div v-else class="py-5 w-full h-full">
    <NuxtLink :to="`/${realm}/organisation-admin`">
      <Button label="Back" icon="pi pi-chevron-left" link></Button>
    </NuxtLink>
    <div class="px-4 mt-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmUserStore } from '~/stores/realm/user'

const route = useRoute()
const realmUserStore = useRealmUserStore()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmUserStore)
</script>

<style>
.p-panel-content-container {
  @apply grow;
}

.p-panel-content {
  @apply h-full;
}
</style>
