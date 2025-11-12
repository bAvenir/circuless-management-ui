<template>
  <div class="w-full h-full container mx-auto pt-8">
    <div class="w-full h-full flex flex-col gap-4 items-end">
      <div class="w-fit">
        <Button icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" severity="secondary" />
      </div>
      <div class="w-full grow">
        <RealmUserTable :users="all ?? []" :loading="loadingUser" />
      </div>
      <Dialog v-model:visible="inviteUserVisible" modal class="min-w-[556px]" :draggable="false" :resizable="false">
        <template #header>
          <h5 class="pl-1">Invite user</h5>
        </template>
        <RealmUserInvite
          :kcOrganisationId="user?.organisation?.kcId"
          :loading="loadingUser || loadingCirculess"
          @onSave="onUserInvited"
          @onCancel="inviteUserVisible = false"
        />
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { userTypes } from '~/shared/types'
import { useRealmUserStore } from '~/stores/realm/user'
import { useCirculessUserStore } from '~/stores/circuless/user'

const realmUserStore = useRealmUserStore()
const circulessUserStore = useCirculessUserStore()
const toast = useToastService()
const router = useRouter()

const { one: user, all, loading: loadingUser } = storeToRefs(realmUserStore)
const { loading: loadingCirculess } = storeToRefs(circulessUserStore)

const inviteUserVisible = ref(false)

await callOnce(async () => {
  await realmUserStore.getAll('circuless')
})

const onUserInvited = async (data: userTypes.InviteBodyRealm) => {
  try {
    await circulessUserStore.invite(data)
    toast.predefined.user.invited.success()
    inviteUserVisible.value = false
  } catch (error) {
    toast.predefined.user.invited.error(error)
  }
}

const onUserDeleted = async (userId: string) => {
  try {
    // await masterUserStore.delete(userId)
    toast.predefined.user.deleted.success()
  } catch (error) {
    toast.predefined.user.deleted.error(error)
  }
}

const onUserSelected = (userId: string) => {
  router.push({ path: `/circuless/home/users/${userId}` })
}
</script>

<style></style>
