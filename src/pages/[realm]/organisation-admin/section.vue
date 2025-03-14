<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="container mx-auto h-full">
    <div class="py-4 h-full flex items-center justify-between gap-4">
      <Panel class="h-full w-56">
        <template #header>
          <RealmOraganisationAdminPreview :organisation="my" :loading="loading" />
        </template>
        <RealmOraganisationAdminMenu :realm="realm" />
      </Panel>
      <NuxtPage />
    </div>
  </div>
  <div v-else class="py-5">
    <NuxtLink :to="`/${realm}/organisation-admin`">
      <Button label="Back" icon="pi pi-chevron-left" link></Button>
    </NuxtLink>
    <div class="px-4 mt-4">
      <NuxtPage />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RealmOraganisationAdminMenu, RealmOraganisationAdminPreview } from '#components'
import type { Realm } from '@prisma/client'
import { useRealmOrganisationStore } from '~/stores/realm/organisation'

const route = useRoute()
const realmOrganisationStore = useRealmOrganisationStore()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmOrganisationStore)

await realmOrganisationStore.getMy(realm.value)
</script>

<style></style>
