<template>
  <div class="w-full h-full">
    <div class="pb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText type="text" v-model="search" placeholder="Search item..." />
      </IconField>
      <pre>{{ allMyItems }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const realmNodeStore = useRealmNodeStore()
const { allMyItems, loading } = storeToRefs(realmNodeStore)
const route = useRoute()
const router = useRouter()

const search = ref('')
const realm = ref(route.params.realm as Realm)
const nodeId = ref(route.params.id as string)

await callOnce(async () => {
  await realmNodeStore.getMyItems()
})

const onItemSelected = (itemId: string) => {
  router.push({ path: `/${realm.value}/node-admin/${nodeId.value}/discovery/${itemId}` })
}
</script>

<style></style>
