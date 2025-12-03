<template>
  <div class="w-[100%] flex flex-row justify-between">
    <div class="w-full h-full overflow-y-auto">
      <div v-if="$viewport.isLessOrEquals('tablet')" class="py-5 bg-black w-10">
        <Button class="!bg-cyan-500/10 hover:!bg-cyan-500/20 !text-cyan-300
                 !border !border-cyan-400/40 rounded-lg shadow-md shadow-black/20" label="Back" link icon="pi pi-chevron-left" @click="goToItems"></Button>
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
      <Button class="text-color-emphasis" icon="pi pi-ellipsis-v" text @click="menuVisible = !menuVisible" />

      <div v-if="menuVisible" class="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border p-2 z-50">
        <div class="flex flex-col gap-3">
          <Button
            label="New TD"
            icon="pi pi-plus"
            severity="contrast"
          class="!bg-cyan-700 !border-none hover:!opacity-90 w-full"
            @click="openTDModal"
          />
          <Button class="w-full bg-red-700" label="Delete TD" severity="danger" icon="pi pi-trash" @click="openDeleteModal" />
          <Button class="w-full bg-gray-400" label="Update TD" severity="secondary" icon="pi pi-pencil" @click="openUpdateTDModal" />
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="showTDJSONModal" modal maximizable header="Thing Description"
    :style="{ width: '90vw', maxWidth: '900px' }" class="rounded-lg overflow-hidden">
    <div class="!bg-gradient-to-b from-[#0e1523] via-[#1d113e] to-[#05060a] hover:!opacity-85 text-green-300 p-4 h-[70vh] overflow-y-auto rounded-lg">
      <pre class="whitespace-pre-wrap break-all">
{{ JSON.stringify(myItem?.td, null, 2) }}
    </pre>
    </div>
  </Dialog>
    <Dialog v-model:visible="showDeleteModal" modal header="Delete Thing Description" :style="{ width: '500px' }"
      class="rounded-lg">
      <p class="text-red-500 font-medium mb-4">
        This action is permanent and cannot be undone.
      </p>

      <p class="mb-2">
        To confirm, type the name of the Thing Description:
      </p>

      <div class="font-semibold mb-4 text-gray-700">
        "{{ myItem?.td?.title }}"
      </div>

      <InputText v-model="deleteInput" class="w-full" placeholder="Type the name exactly" />

      <div class="flex justify-end gap-3 mt-5">
        <Button label="Cancel" outlined @click="showDeleteModal = false" />

        <Button label="Delete Permanently" severity="danger" :disabled="deleteInput !== myItem?.td?.title"
          @click="openTDDeleteModal" />
      </div>
    </Dialog>
  <Dialog
  v-model:visible="showUpdateModal"
  modal
  header="Update Thing Description"
  :style="{ width: '80vw', maxWidth: '900px' }"
  class="rounded-lg"
>
  <div class="flex flex-col gap-6">

    <p class="text-gray-700">
      Edit the fields of the Thing Description.
    </p>

    <!-- TITLE -->
    <div>
      <label class="font-medium text-sm text-gray-600">Title</label>
      <InputText v-model="formTD.title" class="w-full mt-1" />
    </div>

    <!-- DESCRIPTION -->
    <div>
      <label class="font-medium text-sm text-gray-600">Description</label>
      <Textarea v-model="formTD.description" class="w-full mt-1" autoResize rows="3" />
    </div>

    <!-- @type -->
    <div>
      <label class="font-medium text-sm text-gray-600">@type</label>
      <InputText v-model="formTD['@type']" class="w-full mt-1" />
    </div>

    <!-- PROPERTIES JSON  -->
    <div>
      <label class="font-medium text-sm text-gray-600">Properties (JSON)</label>
      <Textarea
        v-model="formTD_properties"
        class="w-full font-mono mt-1 bg-gray-900 text-green-300"
        rows="6"
      />
    </div>

    <div class="flex justify-end gap-3 pt-4 border-t">
      <Button label="Cancel" outlined @click="showUpdateModal = false" />
      <Button
        label="Update"
        icon="pi pi-check"
        class="!bg-cyan-600 !border-none hover:!opacity-85"
        @click="submitTDUpdate"
      />
    </div>

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
import { TDsManagement, type FetchThingDescription } from '~/api/realm/td'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const realmNodeStore = useRealmNodeStore()
const router = useRouter()
const { myItem, loading } = storeToRefs(realmNodeStore)

const realm = ref(route.params.realm as Realm)
const itemId = ref(route.params.itemId as string)
const nodeId = ref(route.params.id as string)

watch(
  () => route.params.itemId,
  async newId => {
    itemId.value = String(newId)
    await realmNodeStore.getMyItem(realm.value, nodeId.value, itemId.value)
  },
  { immediate: true }
)
const goToItems = () => {
  const nodeId = route.params.id as string
  router.push({ path: `/${realm.value}/node-admin/${nodeId}/items` })
}

const showTDJSONModal = ref(false)

const openTDModal = () => {
  showTDJSONModal.value = true
}

const menuVisible = ref(false)

const showTDDeleteModal = ref(false)
const showDeleteModal = ref(false)
const deleteInput = ref("")

const openDeleteModal = () => {
  deleteInput.value = ""
  showDeleteModal.value = true
}


const openTDDeleteModal = async () => {
  showTDDeleteModal.value = true
  try {
    const result = await TDsManagement.deleteTD(realm.value, nodeId.value, itemId.value)

    if (!result) {
      toast.add({
        severity: 'error',
        summary: 'Delete failed',
        detail: 'Could not delete the item.',
        life: 3000
      })
    } else {
      toast.add({
        severity: 'success',
        summary: `deleted`,
        detail: `success delete the TD with id ${itemId.value}`,
        life: 3000
      })
    }
    await realmNodeStore.getMyItems(realm.value, nodeId.value)
    goToItems();

  } catch (err) {

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unexpected error occurred.',
      life: 3000
    })
  } finally {
    loading.value = false
  }

  menuVisible.value = false
  showDeleteModal.value = false

};

const showUpdateModal = ref(false)
const editTDJson = ref("")
const formTD = ref<any>({})
const formTD_properties = ref("")


const openUpdateTDModal = () => {
  const td = (myItem.value?.td ?? {}) as FetchThingDescription

// const openUpdateTDModal = () => {
//   const td = myItem.value?.td

//   if (!td) {
//     console.error("No TD found for this item")
//     return
//   }

//   // Fill formTD with editable top-level fields
//   formTD.value = {
//     title: td.title ?? "",
//     description: td.description ?? "",
//     "@type": td["@type"] ?? "",
//   }

//   // Properties as editable JSON
//   formTD_properties.value = JSON.stringify(td.properties ?? {}, null, 2)

//   showUpdateModal.value = true
//   menuVisible.value = false
// }

  showUpdateModal.value = true
  menuVisible.value = false
}

const submitTDUpdate = async () => {
  try {
    let parsedProperties
    try {
      parsedProperties = JSON.parse(formTD_properties.value)
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Invalid JSON',
        detail: 'Fix the JSON and try again.',
        life: 3000
      })
      return
    }

    const updatedTD = {
      ...formTD.value,
      properties: parsedProperties
    }

    await realmNodeStore.updateMyItem(
      realm.value,
      nodeId.value,
      itemId.value,
      updatedTD
    )

    await realmNodeStore.getMyItem(realm.value, nodeId.value, itemId.value)

    toast.add({
      severity: 'success',
      summary: 'TD Updated',
      detail: 'Your changes were saved.',
      life: 2500
    })

    showUpdateModal.value = false

  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: 'Unexpected error occurred.',
      life: 3000
    })
  }
}


</script>

<style></style>
