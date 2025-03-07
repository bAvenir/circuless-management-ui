<template>
  <div class="w-full h-full flex flex-col gap-4 items-end">
    <div class="w-fit">
      <Button icon="pi pi-plus" label="Add node" @click="createNodeVisible = true" />
    </div>
    <div class="w-full grow">
      <MasterNodeTable :nodes="allNodes ?? []" :loading="loading" />
    </div>
    <Dialog v-model:visible="createNodeVisible" modal class="min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Add node</h5>
      </template>
      <MasterNodeCreate :loading="loading" @onSave="onNodeCreated" @onCancel="createNodeVisible = false"></MasterNodeCreate>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { nodeTypes } from '~/shared/types'
import { useMasterNodeStore } from '~/stores/master/node'

const masterNodeStore = useMasterNodeStore()
const toast = useToastService()
const router = useRouter()

const { allNodes, loading } = storeToRefs(masterNodeStore)

const createNodeVisible = ref(false)

await masterNodeStore.getAll()

const onNodeCreated = async (data: nodeTypes.CreateBodyMaster) => {
  try {
    await masterNodeStore.create(data)
    toast.predefined.node.created.success()
    createNodeVisible.value = false
  } catch (error) {
    toast.predefined.node.created.error()
    throw error
  }
}

const onNodeDeleted = async (nodeId: string) => {
  try {
    // await masterNodeStore.delete(nodeId)
    toast.predefined.node.deleted.success()
  } catch (error) {
    toast.predefined.node.deleted.error()
    throw error
  }
}

const onNodeSelected = (nodeId: string) => {
  router.push({ path: `/admin/home/nodes/${nodeId}` })
}
</script>

<style></style>
