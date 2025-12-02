<template>
  <div class="w-full h-full flex">
    <div class="h-full grow flex flex-col lg:max-w-[400px] pt-4 lg:pt-0">
       <!-- HEADER with simple modal trigger -->
      <div class="flex justify-between items-center px-4 lg:px-0 pb-4">
        <h2 class="text-lg font-semibold">Items</h2>

        <Button
          label="New TD"
          icon="pi pi-plus"
          class="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
          @click="showModal = true"
        />
      </div>
      <RealmNodeAdminItemTable :items="typedItems" @onSelect="onItemSelected" :selectedItemId="String(itemId)" />
    </div>
    <Divider v-if="$viewport.isGreaterThan('tablet')" layout="vertical" />
    <div v-if="$viewport.isGreaterThan('tablet')" class="grow h-full rounded-md bg-slate-100 flex items-center justify-center text-slate-300">
      No item selected
    </div>
  </div>
  <Dialog
  v-model:visible="showModal"
  modal
  header="Create New Thing Description"
  :style="{ width: '600px' }"
  class="rounded-lg"
>
  <div class="flex flex-col gap-4">

    <!-- TITLE -->
    <div>
      <label class="font-medium text-sm text-gray-600">Title</label>
      <InputText v-model="newTD.title" class="w-full mt-1" />
    </div>

    <!-- DESCRIPTION -->
    <div>
      <label class="font-medium text-sm text-gray-600">Description</label>
      <Textarea v-model="newTD.description" class="w-full mt-1" rows="3" />
    </div>

    <!-- PROPERTIES JSON -->
    <div>
      <label class="font-medium text-sm text-gray-600">Properties (JSON)</label>
      <Textarea
        v-model="newTDPropertiesJson"
        class="w-full font-mono mt-1 bg-gray-900 text-green-300"
        rows="5"
      />
    </div>

    <!-- ACTIONS JSON -->
    <div>
      <label class="font-medium text-sm text-gray-600">Actions (JSON)</label>
      <Textarea
        v-model="newTDActionsJson"
        class="w-full font-mono mt-1 bg-gray-900 text-green-300"
        rows="4"
      />
    </div>

    <!-- EVENTS JSON -->
    <div>
      <label class="font-medium text-sm text-gray-600">Events (JSON)</label>
      <Textarea
        v-model="newTDEventsJson"
        class="w-full font-mono mt-1 bg-gray-900 text-green-300"
        rows="4"
      />
    </div>

    <!-- ACTION BUTTONS -->
    <div class="flex justify-end gap-3 border-t pt-3 mt-3">
      <Button
        label="Cancel"
        severity="secondary"
        @click="showModal = false"
      />

      <Button
        label="Upload TD"
        icon="pi pi-upload"
        class="bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
        @click="submitCreateTD"
      />
    </div>

  </div>
</Dialog>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'
import { computed } from 'vue'
import { TDsManagement, type PostThingDescription } from '~/api/realm/td'
import { useToast } from 'primevue/usetoast'


    const newTD = ref<PostThingDescription>({
  title: "",
  description: "",
  properties: {},
  actions: {},
  events: {}
})

const toast = useToast()

const realmNodeStore = useRealmNodeStore()
const { allMyItems, loading } = storeToRefs(realmNodeStore)
const route = useRoute()
const router = useRouter()

const realm = ref(route.params.realm as Realm)
const nodeId = ref(route.params.id as string)
const itemId = ref(route.params.itemId as string)

const typedItems = computed(() => (allMyItems.value ?? []) as unknown as any[])

await callOnce(async () => {
  return await realmNodeStore.getMyItems(realm.value, nodeId.value)

})


const onItemSelected = (id: string) => {
  itemId.value = id
 router.push({ path: `/${realm.value}/node-admin/${nodeId.value}/items/${id}`})
}

const showModal = ref(false)
const newTDPropertiesJson = ref("{}")
const newTDActionsJson = ref("{}")
const newTDEventsJson = ref("{}")

const submitCreateTD = async () => {
  try {
    console.log('HASTA AQUI 1')
    const properties = JSON.parse(newTDPropertiesJson.value || "{}")
    const actions = JSON.parse(newTDActionsJson.value || "{}")
    const events = JSON.parse(newTDEventsJson.value || "{}")


    const finalTD: PostThingDescription = {
      title: newTD.value.title,
      description: newTD.value.description,
      properties,
      actions,
      events
    }

    console.log('HASTA AQUI 2', finalTD)

    await TDsManagement.postTD(
      realm.value,
      nodeId.value,
      finalTD
    )
    console.log('HASTA AQUI 3')

    await realmNodeStore.getMyItems(realm.value, nodeId.value)

    toast.add({
      severity: "success",
      summary: "TD Added",
      detail: "New Thing Description successfully created.",
      life: 2500
    })

    showModal.value = false
        console.log('HASTA AQUI 4')

  } catch (err) {

    toast.add({
      severity: "error",
      summary: "Invalid JSON",
      detail: "Fix JSON in Properties/Actions/Events.",
      life: 3000
    })
  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
