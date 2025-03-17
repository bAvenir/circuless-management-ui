<template>
  <div class="w-full h-full pt-8">
    <MasterUserTable :users="organisation?.users ?? []" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { useMasterOrganisationStore } from '~/stores/master/organisation'

const masterOrganisationStore = useMasterOrganisationStore()
const toast = useToastService()
const router = useRouter()

const { organisation, loading } = storeToRefs(masterOrganisationStore)

const onUserDeleted = async (orderId: string) => {
  // try {
  //   await masterCientStore.deleteOrder(orderId)
  //   toast.predefined.order.deleted.success()
  // } catch (error) {
  //   toast.predefined.order.deleted.error()
  //   throw error
  // }
}

const onUserSelected = (orderId: string) => {
  router.push(`/master/home/orders/${orderId}`)
}
</script>
