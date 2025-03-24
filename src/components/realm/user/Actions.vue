<template>
  <div>
    <Button icon="pi pi-ellipsis-h" size="small" outlined @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" :loading="loading" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

const props = defineProps<{
  user: userTypes.GetRealm
  loading: boolean
}>()

const confirm = useConfirm()
const menu = ref()

const { user, loading } = toRefs(props)

const emit = defineEmits(['onSelect', 'onDelete'])

const items = ref([
  // {
  //   label: 'Open detail',
  //   icon: 'pi pi-search',
  //   command: () => {
  //     selectUser()
  //   },
  // },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      confirmDelete()
    },
  },
])

const toggle = (event: Event) => {
  menu.value.toggle(event)
}

const confirmDelete = async () => {
  confirm.require({
    message: 'Are you sure you want to delete this user?',
    header: 'Danger zone',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      await deleteUser()
    },
    reject: () => {
      return
    },
  })
}

const selectUser = () => {
  if (user.value) {
    emit('onSelect', user.value)
  }
}

const deleteUser = async () => {
  if (user.value) {
    emit('onDelete', user.value)
  }
}
</script>

<style></style>
