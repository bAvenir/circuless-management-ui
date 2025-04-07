<template>
  <div class="w-full">
    <div class="w-full">
      <NuxtLink to="/master/nodes">
        <Button label="Back" icon="pi pi-arrow-left" variant="link" />
      </NuxtLink>
    </div>
    <div class="w-full flex justify-center pb-20">
      <div class="grow max-w-[640px] px-2 sm:px-0">
        <Tabs value="0">
          <TabList>
            <Tab value="0">Generate</Tab>
            <Tab value="1">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <h1 class="pb-8 mt-6">Generate node</h1>
              <MasterNodeCreate
                :loading="loading"
                @onSave="onNodeCreated"
                @onCancel="onCancel"
                saveLabel="Generate"
                alignActions="start"
              ></MasterNodeCreate>
            </TabPanel>
            <TabPanel value="1">
              <h1 class="pb-8 mt-6">Register node</h1>
              <MasterNodeCreate
                :loading="loading"
                @onSave="onNodeCreated"
                @onCancel="onCancel"
                saveLabel="Register"
                alignActions="start"
              ></MasterNodeCreate>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { nodeTypes } from '~/shared/types'
import { useMasterNodeStore } from '~/stores/master/node'

const masterNodeStore = useMasterNodeStore()
const toast = useToastService()
const router = useRouter()

const { loading } = storeToRefs(masterNodeStore)

const onNodeCreated = async (data: nodeTypes.CreateBodyMaster) => {
  try {
    await masterNodeStore.create(data)
    toast.predefined.node.created.success()
    onCancel()
  } catch (error) {
    toast.predefined.node.created.error(error)
  }
}

const onCancel = () => {
  router.push({ path: '/master/nodes' })
}
</script>
