<template>
  <div class="w-full">
    <div class="py-8">
      <RealmOraganisationAdminPreview :organisation="my?.organisation" :loading="loading" />
    </div>
    <RealmOraganisationAdminMenu :realm="realm" />
  </div>
</template>

<script lang="ts" setup>
import { RealmOraganisationAdminMenu, RealmOraganisationAdminPreview } from '#components'
import type { Realm } from '@prisma/client'
import { useRealmUserStore } from '~/stores/realm/user'
import { debounce } from 'lodash'

definePageMeta({
  middleware: [
    function (to, from) {
      if (import.meta.server) return
      const { $viewport } = useNuxtApp()
      const realm = to.params.realm as Realm
      const path = `/${realm}/organisation-admin`
      if ($viewport.isGreaterThan('tablet') && to.path === path) {
        return navigateTo(`${path}/section/settings`)
      }
    },
  ],
})

const { $viewport } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const realmUserStore = useRealmUserStore()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmUserStore)
const path = `/${realm.value}/organisation-admin`

if (import.meta.client) {
  onMounted(() => window.addEventListener('resize', handleResize, true))
  onUnmounted(() => window.removeEventListener('resize', handleResize))
}

const handleResize = debounce(() => {
  if ($viewport.isGreaterThan('tablet') && route.path === currentPath.value) {
    navigateTo(`${path}/section/settings`)
  }
}, 200)

const currentPath = computed(() => router.currentRoute.value.path)
</script>

<style></style>
