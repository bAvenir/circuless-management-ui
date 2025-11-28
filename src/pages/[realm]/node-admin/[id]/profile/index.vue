<template>
  <div class="pb-10">
    <RealmNodeAdminNode :my="my" />
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'
import { debounce } from 'lodash'

definePageMeta({
  middleware: [
    function (to, from) {
      if (import.meta.server) return
      const { $viewport } = useNuxtApp()
      const realm = to.params.realm as Realm
      const id = to.params.id as string
      const path = `/${realm}/node-management/${id}`
      if ($viewport.isGreaterThan('tablet') && to.path === `${path}/profile`) {
        return navigateTo(`${path}/items`)
      }
    },
  ],
})

const { $viewport } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const realmNodeStore = useRealmNodeStore()
const { my, loading } = storeToRefs(realmNodeStore)

const realm = ref(route.params.realm as Realm)
const id = ref(route.params.id as string)

const path = `/${realm.value}/node-admin/${id.value}`

if (import.meta.client) {
  onMounted(() => window.addEventListener('resize', handleResize, true))
  onUnmounted(() => window.removeEventListener('resize', handleResize))
}

const handleResize = debounce(() => {
  if ($viewport.isGreaterThan('tablet') && route.path === currentPath.value) {
    navigateTo(`${path}/items`)
  }
}, 10)

const currentPath = computed(() => router.currentRoute.value.path)
</script>

<style></style>
