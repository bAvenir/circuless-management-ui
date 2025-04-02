<template>
  <div class="w-full h-full overflow-y-auto">
    <div v-if="$viewport.isLessOrEquals('tablet')" class="py-5">
      <Button label="Back" link icon="pi pi-chevron-left" @click="goToItems"></Button>
    </div>
    <div class="w-full">
      <div class="flex items-center gap-4 px-4 lg:px-0">
        <div class="size-10 bg-lightBrown text-white rounded-md flex items-center justify-center text-xl">
          <font-awesome-icon icon="fa fa-cube" />
        </div>
        <div class="flex flex-col">
          <div class="text-lg font-medium">{{ myItem?.title }}</div>
          <RealmNodeAdminItemType :item="myItem" class="text-realm-text-300 text-sm" />
        </div>
      </div>
      <div class="flex flex-col gap-1 mt-10 text-sm px-4 lg:px-0">
        <div class="flex items-start gap-1">
          <div class="text-realm-text-300">oid:</div>
          <div>{{ myItem?.oid }}</div>
        </div>
        <div class="flex items-center gap-1">
          <i class="pi pi-users text-realm-text-300"></i>
          <div class="text-realm-text-300">Owner:</div>
          <div>{{ myItem?.organisation?.name }}</div>
        </div>
      </div>
      <div class="text-sm mt-10 max-w-96 flex flex-col gap-1 px-4 lg:px-0">
        <div class="text-realm-text-300">Description:</div>
        <div>{{ myItem?.description }}</div>
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
              <div class="text-sm">Properties ({{ Object.keys(myItem?.properties ?? {}).length }})</div>
            </Tab>
            <Tab value="1">
              <div class="text-sm">Events (0)</div>
            </Tab>
          </TabList>
          <TabPanels :pt="{'root': 'px-1'}">
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
</template>

<script lang="ts" setup>
const route = useRoute()
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const realmNodeStore = useRealmNodeStore()
const router = useRouter()
const { myItem, loading } = storeToRefs(realmNodeStore)

const realm = ref(route.params.realm as Realm)
const itemId = ref(route.params.itemId as string)

await realmNodeStore.getMyItem(itemId.value, realm.value)

const goToItems = () => {
  const nodeId = route.params.id as string
  router.push({ path: `/${realm.value}/node-admin/${nodeId}/items` })
}
</script>

<style></style>
