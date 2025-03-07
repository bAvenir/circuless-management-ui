<template>
  <div class="w-full h-full flex flex-col gap-4 items-end">
    <div class="w-fit">
      <NuxtLink to="/master/nodes/add">
        <Button icon="pi pi-plus" label="Add node" />
      </NuxtLink>
    </div>
    <div class="w-full grow">
      <MasterNodeTable :nodes="allNodes ?? []" :loading="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMasterNodeStore } from '~/stores/master/node'

const masterNodeStore = useMasterNodeStore()
const toast = useToastService()
const router = useRouter()

const { allNodes, loading } = storeToRefs(masterNodeStore)

await masterNodeStore.getAll()

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
