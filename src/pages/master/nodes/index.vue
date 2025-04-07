<template>
  <div class="w-full h-full flex flex-col gap-4 items-end">
    <div class="w-fit">
      <NuxtLink to="/master/nodes/add">
        <Button icon="pi pi-plus" label="Add node" severity="secondary" />
      </NuxtLink>
    </div>
    <div class="w-full grow">
      <MasterNodeTable :nodes="allMy ?? []" :loading="loading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMasterNodeStore } from '~/stores/master/node'

const masterNodeStore = useMasterNodeStore()
const toast = useToastService()
const router = useRouter()

const { allMy, loading } = storeToRefs(masterNodeStore)

await callOnce(async () => {
  await masterNodeStore.getAll()
})

const onNodeDeleted = async (nodeId: string) => {
  try {
    // await masterNodeStore.delete(nodeId)
    toast.predefined.node.deleted.success()
  } catch (error) {
    toast.predefined.node.deleted.error(error)
  }
}

const onNodeSelected = (nodeId: string) => {
  router.push({ path: `/admin/home/nodes/${nodeId}` })
}
</script>

<style></style>
