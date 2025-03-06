<template>
  <div class="w-full h-full flex flex-col gap-4 items-end">
    <div class="w-fit">
      <Button icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" />
    </div>
    <div class="w-full grow">
      <UserTable :users="allUsers ?? []" :loading="loadingUser" />
    </div>
    <Dialog v-model:visible="inviteUserVisible" modal class="min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Invite user</h5>
      </template>
      <RealmUserInvite
        realm="circuless"
        :kcOrganisationId="myOrganisation?.kcId"
        :loading="loadingUser || loadingCirculess || loadingOrganisation"
        @onSave="onUserInvited"
        @onCancel="inviteUserVisible = false"
      ></RealmUserInvite>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { userTypes } from '~/shared/types'
import { useRealmUserStore } from '~/stores/realm/user'
import { useCirculessUserStore } from '~/stores/circuless/user'
import { useRealmOrganisationStore } from '~/stores/realm/organisation'

const realmUserStore = useRealmUserStore()
const circulessUserStore = useCirculessUserStore()
const realmOrganisationStore = useRealmOrganisationStore()
const toast = useToastService()
const router = useRouter()

const { allUsers, loading: loadingUser } = storeToRefs(realmUserStore)
const { loading: loadingCirculess } = storeToRefs(circulessUserStore)
const { myOrganisation, loading: loadingOrganisation } = storeToRefs(realmOrganisationStore)

const inviteUserVisible = ref(false)

realmUserStore.init('circuless')
realmOrganisationStore.init('circuless')
await realmOrganisationStore.getMy()
await realmUserStore.getAll()

const onUserInvited = async (data: userTypes.InviteBody) => {
  try {
    await circulessUserStore.invite(data)
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
  router.push({ path: `/circuless/circuless/home/users/${userId}` })
}
</script>

<style></style>
