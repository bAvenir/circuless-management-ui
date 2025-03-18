<template>
  <div v-if="my" class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation users" class="w-full h-full flex flex-col">
      <div class="w-full h-full flex flex-col items-end">
        <div class="w-fit">
          <Button icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" />
        </div>
        <RealmOraganisationAdminUsers :my="my.organisation" :loading="loading" class="w-full" />
      </div>
    </Panel>
    <div v-else class="flex flex-col h-full w-full gap-7">
      <div class="w-full relative">
        <div class="font-medium">Organisation users</div>
        <div class="w-fit -top-[60px] right-0 absolute">
          <Button icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" />
        </div>
      </div>
      <RealmOraganisationAdminUsers :my="my.organisation" :loading="loading" />
    </div>
    <Dialog v-model:visible="inviteUserVisible" modal class="min-w-[375px] lg:min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Invite user</h5>
      </template>
      <RealmUserInvite
        realm="circuless"
        :kcOrganisationId="my?.organisation?.kcId"
        :loading="loading"
        @onSave="onUserInvited"
        @onCancel="inviteUserVisible = false"
      ></RealmUserInvite>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'
import { useRealmUserStore } from '~/stores/realm/user'

const realmUserStore = useRealmUserStore()
const toast = useToastService()
const router = useRouter()

const { my, loading } = storeToRefs(realmUserStore)
const inviteUserVisible = ref(false)

const onUserInvited = async (data: userTypes.InviteBody) => {
  try {
    await realmUserStore.invite(data)
    toast.predefined.user.invited.success()
    inviteUserVisible.value = false
  } catch (error) {
    toast.predefined.user.invited.error()
    throw error
  }
}

const onUserDeleted = async (userId: string) => {
  try {
    // await masterUserStore.delete(userId)
    toast.predefined.user.deleted.success()
  } catch (error) {
    toast.predefined.user.deleted.error()
    throw error
  }
}

const onUserSelected = (userId: string) => {
  router.push({ path: `/circuless/home/users/${userId}` })
}
</script>

<style></style>
