<template>
  <div class="w-full">
    <div class="py-8">
      <RealmOraganisationAdminPreview :organisation="my" :loading="loading" />
    </div>
    <RealmOraganisationAdminMenu :realm="realm" />
  </div>
</template>

<script lang="ts" setup>
import { RealmOraganisationAdminMenu, RealmOraganisationAdminPreview } from '#components'
import type { Realm } from '@prisma/client'
import { useRealmOrganisationStore } from '~/stores/realm/organisation'

definePageMeta({
  middleware: [
    function (to, from) {
      const { $viewport } = useNuxtApp()
      const realm = to.params.realm as Realm
      const path = `/${realm}/organisation-admin`
      if ($viewport.isGreaterThan('tablet') && to.path === path) {
        return navigateTo(`${path}/section/settings`)
      }
    },
  ],
})

const route = useRoute()
const realmOrganisationStore = useRealmOrganisationStore()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmOrganisationStore)

await realmOrganisationStore.getMy(realm.value)
</script>

<style></style>
