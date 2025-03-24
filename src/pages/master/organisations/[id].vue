<template>
  <div class="w-full h-full">
    <NuxtLink to="/master/organisations">
      <Button label="Back" icon="pi pi-arrow-left" variant="link" />
    </NuxtLink>
    <div class="px-4 mt-3 w-full flex items-center justify-between gap-4">
      <div>
        <div>Organisation</div>
        <h1 class="mt-1">{{ organisation?.name }}</h1>
      </div>
      <Button v-if="active?.route == tabs[0].route" icon="pi pi-plus" label="Add user" @click="inviteUserVisible = true" severity="secondary" />
      <Button v-if="active?.route == tabs[1].route" icon="pi pi-plus" label="Add node"  severity="secondary"/>
    </div>
    <div class="mt-8 px-4">
      <Tabs :value="active?.route ?? tabs[0].route" @update:value="onTabChange">
        <TabList>
          <Tab v-for="(tab, index) in tabs" :key="index" :value="tab.route">
            {{ tab.label }}
          </Tab>
        </TabList>
      </Tabs>
      <NuxtPage />
    </div>
    <Dialog v-model:visible="inviteUserVisible" modal class="min-w-[556px]" :draggable="false" :resizable="false">
      <template #header>
        <h5 class="pl-1">Invite user</h5>
      </template>
      <MasterUserInvite
        v-if="organisation"
        :organisation="organisation"
        :loading="loading"
        @onSave="onUserInvited"
        @onCancel="inviteUserVisible = false"
      ></MasterUserInvite>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { userTypes } from '~/shared/types'
import { useMasterOrganisationStore } from '~/stores/master/organisation'

const route = useRoute()
const router = useRouter()
const toast = useToastService()
const confirm = useConfirm()
const masterOrganisationStore = useMasterOrganisationStore()

const id = ref(route.params.id as string)
const { organisation, loading } = storeToRefs(masterOrganisationStore)
const inviteUserVisible = ref(false)

await masterOrganisationStore.get(id.value)

// const avaliableProducts = ref(await api.product.master.getAll())

const tabs = ref([
  { label: 'Users', route: `/master/organisations/${id.value}/users` },
  { label: 'Nodes', route: `/master/organisations/${id.value}/nodes` },
])

const onUserInvited = async (data: userTypes.InviteBody) => {
  try {
    await masterOrganisationStore.inviteUser(data)
    toast.predefined.user.invited.success()
    inviteUserVisible.value = false
  } catch (error) {
    toast.predefined.user.invited.error()
    throw error
  }
}

const active = computed(() => tabs.value.find((tab) => tab.route === route.path))

const onTabChange = (value: string | number) => {
  if (typeof value === 'string') {
    router.push(value)
  } else {
    router.push(tabs.value[value].route)
  }
}
</script>
