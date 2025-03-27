<template>
  <div class="w-full h-full">
    <div class="pb-4">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText type="text" v-model="search" placeholder="Search contracts..." />
      </IconField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const realmNodeStore = useRealmNodeStore()
const { loading } = storeToRefs(realmNodeStore)
const route = useRoute()
const router = useRouter()

const search = ref('')
const realm = ref(route.params.realm as Realm)
const nodeId = ref(route.params.id as string)

const onContractSelected = (contractId: string) => {
  router.push({ path: `/${realm.value}/node-admin/${nodeId.value}/contracts/${contractId}` })
}
</script>

<style></style>
