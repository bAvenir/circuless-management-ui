<template>
  <div v-if="my" class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation users" class="w-full h-full flex flex-col">
      <div class="w-full h-full flex flex-col items-end">
        <div class="w-fit">
          <Button icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" severity="secondary" />
        </div>
        <div class="w-full h-[calc(100dvh-200px)] overflow-y-auto">
          <RealmOraganisationAdminUsers :my="my.organisation" :loading="loading" class="w-full" />
        </div>
      </div>
    </Panel>
    <div v-else class="flex flex-col h-full w-full gap-7">
      <div class="w-full relative">
        <div class="font-medium">Organisation users</div>
        <div class="w-fit -top-[60px] right-0 absolute">
          <Button icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" severity="secondary" />
        </div>
      </div>
      <RealmOraganisationAdminUsers :my="my.organisation" :loading="loading" @onRemove="onUserRemoved" />
    </div>
    <Dialog v-model:visible="inviteUserVisible" modal class="min-w-[375px] lg:min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Invite user</h5>
      </template>
      <RealmUserInvite
        :realm="realm"
        :kcOrganisationId="my?.organisation?.kcId"
        :loading="loading"
        @onSave="onUserInvited"
        @onCancel="inviteUserVisible = false"
      ></RealmUserInvite>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import type { userTypes } from '~/shared/types'
import { useRealmUserStore } from '~/stores/realm/user'

const realmUserStore = useRealmUserStore()
const toast = useToastService()
const route = useRoute()
const router = useRouter()

const realm = ref(route.params.realm as Realm)
const { my, loading } = storeToRefs(realmUserStore)
const inviteUserVisible = ref(false)

const onUserInvited = async (data: userTypes.InviteBody) => {
  try {
    await realmUserStore.inviteUserToMyOrganisation(data)
    toast.predefined.user.invited.success()
    inviteUserVisible.value = false
  } catch (error) {
    toast.predefined.user.invited.error(error)
  }
}

const onUserRemoved = async (userId: string) => {
  try {
    await realmUserStore.removeUsersFromMyOrganisation({ userIds: [userId] })
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
