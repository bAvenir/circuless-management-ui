<template>
  <div class="w-[100%] flex flex-row justify-between">
    <div class="w-full h-full overflow-y-auto">
      <div v-if="$viewport.isLessOrEquals('tablet')" class="py-5 bg-black w-10">
        <Button label="Back" link icon="pi pi-chevron-left" @click="goToItems"></Button>
      </div>

      <div class="w-full">
        <div class="flex items-center gap-4 px-4 lg:px-0">
          <div class="size-10 bg-lightBrown text-white rounded-md flex items-center justify-center text-xl">
            <font-awesome-icon icon="fa fa-cube" />
          </div>
          <div class="flex flex-col">
            <div class="text-lg font-medium">{{ myItem?.td?.title }}</div>
            <RealmNodeAdminItemType :item="myItem" class="text-realm-text-300 text-sm" />
          </div>
        </div>
        <div class="flex flex-col gap-1 mt-10 text-sm px-4 lg:px-0">
          <div class="flex items-start gap-1">
            <div class="text-realm-text-300">oid:</div>
            <div>{{ myItem?.oid }}</div>
          </div>
        </div>
        <div class="text-sm mt-10 max-w-96 flex flex-col gap-1 px-4 lg:px-0">
          <div class="text-realm-text-300">Description:</div>
          <div>{{ myItem?.td?.description }}</div>
        </div>
        <div class="mt-10 flex gap-4 px-4 lg:px-0">
          <Button severity="secondary" size="small">
            <i class="pi pi-globe" />
            <div class="font-medium">Public</div>
            <i class="pi pi-chevron-down text-xs" />
          </Button>
          <Button severity="secondary" size="small">
            <font-awesome-icon icon="fa-solid fa-file-signature" />
            <div class="font-medium">Contracts</div>
            <i class="pi pi-chevron-right text-xs" />
          </Button>
        </div>
        <div class="mt-10">
          <Tabs value="0">
            <TabList>
              <Tab value="0">
                <div class="text-sm">Properties ({{ Object.keys(myItem?.td?.properties ?? {}).length }})</div>
              </Tab>
              <Tab value="1">
                <div class="text-sm">Events (0)</div>
              </Tab>
            </TabList>
            <TabPanels :pt="{ 'root': 'px-0' }">
              <TabPanel value="0">
                <RealmNodeAdminItemPropsTable :item="myItem" />
              </TabPanel>
              <TabPanel value="1">
                <RealmNodeAdminItemEventsTable />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
    <div class="relative ml-auto mr-4 lg:mr-0">
      <Button icon="pi pi-ellipsis-v" text @click="menuVisible = !menuVisible" />

      <div v-if="menuVisible" class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border p-2 z-50">
        <button class="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2" @click="openTDModal">
          <i class="pi pi-code"></i>
          Show TD
        </button>
      </div>
    </div>
  </div>
  <Dialog
  v-model:visible="showTDModal"
  modal
  maximizable
  header="Thing Description"
  :style="{ width: '90vw', maxWidth: '900px' }"
  class="rounded-lg overflow-hidden"
>
  <div class="bg-[#06233b] text-green-300 p-4 h-[70vh] overflow-y-auto rounded-lg">
    <pre class="whitespace-pre-wrap break-all">
{{ JSON.stringify(myItem?.td, null, 2) }}
    </pre>
  </div>
</Dialog>
</template>

<script lang="ts" setup>
const route = useRoute()
import type { Realm } from '@prisma/client'
import { Button } from 'primevue'
import { useRealmNodeStore } from '~/stores/realm/node'
import { ref } from 'vue'
import Dialog from 'primevue/dialog'

const realmNodeStore = useRealmNodeStore()
const router = useRouter()
const { myItem, loading } = storeToRefs(realmNodeStore)

const realm = ref(route.params.realm as Realm)
const itemId = ref(route.params.itemId as string)

watch(() => route.params.itemId, async newId => {
  await realmNodeStore.getMyItem(String(newId))
}, { immediate: true })

const goToItems = () => {
  const nodeId = route.params.id as string
  router.push({ path: `/${realm.value}/node-admin/${nodeId}/items` })
}

const showTDModal = ref(false)

const openTDModal = () => {
  showTDModal.value = true
}

const menuVisible = ref(false)
</script>

<style></style>
