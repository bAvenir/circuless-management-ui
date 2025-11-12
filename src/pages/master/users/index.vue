<template>
    <div class="w-full h-full flex flex-col gap-4 items-end">
        <div class="w-fit">
            <Button
                icon="pi pi-plus"
                label="Add user"
                @click="inviteUserVisible = true"
                severity="secondary"
            />
        </div>
        <div class="w-full grow">
            <MasterUserTable :users="allUsers ?? []" :loading="loading">
                <template #table-actions>
                    <Button
                        icon="pi pi-refresh"
                        label="Sync users"
                        severity="secondary"
                        @click="syncUsers"
                        :loading="loading"
                    />
                </template>
            </MasterUserTable>
        </div>
        <Dialog
            v-model:visible="inviteUserVisible"
            modal
            class="min-w-[556px]"
            :draggable="false"
            :resizable="false"
        >
            <template #header>
                <h5 class="pl-1">Invite user</h5>
            </template>
            <MasterUserInvite
                :avaliableOrganisations="allOrganisations ?? []"
                :loading="loading"
                @onSave="onUserInvited"
                @onCancel="inviteUserVisible = false"
            ></MasterUserInvite>
        </Dialog>
        <Dialog
            v-model:visible="syncedUsersVisible"
            modal
            class="min-w-[556px]"
            :draggable="false"
            :resizable="false"
        >
            <template #header>
                <h5 class="pl-1">Affected users</h5>
            </template>
            <MasterUserSyncStatus :affectedUsers="affectedUsers" />
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import type { userTypes } from '~/shared/types'
import { useMasterOrganisationStore } from '~/stores/master/organisation'
import { useMasterUserStore } from '~/stores/master/user'

const masterUserStore = useMasterUserStore()
const masterOrganisationStore = useMasterOrganisationStore()
const toast = useToastService()
const router = useRouter()

const { all: allUsers, loading } = storeToRefs(masterUserStore)
const { all: allOrganisations } = storeToRefs(masterOrganisationStore)

const inviteUserVisible = ref(false)
const syncedUsersVisible = ref(false)

const affectedUsers = ref<userTypes.Sync>({
    created: [],
    updated: [],
    deleted: [],
})

await callOnce(async () => {
    await masterUserStore.getAll()
    await masterOrganisationStore.getAll()
})

const syncUsers = async () => {
    try {
        affectedUsers.value = await masterUserStore.sync()
        toast.predefined.user.synced.success()
        syncedUsersVisible.value = true
    } catch (error) {
        toast.predefined.user.synced.error(error)
    }
}

const onUserInvited = async (data: userTypes.InviteBodyMaster) => {
    try {
        await masterUserStore.invite(data)
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
    router.push({ path: `/admin/home/users/${userId}` })
}
</script>

<style></style>
