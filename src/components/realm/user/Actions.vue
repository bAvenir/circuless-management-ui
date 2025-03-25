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

const emit = defineEmits(['onSelect', 'onRemove'])

const items = ref([
  // {
  //   label: 'Open detail',
  //   icon: 'pi pi-search',
  //   command: () => {
  //     selectUser()
  //   },
  // },
  {
    label: 'Remove',
    icon: 'pi pi-trash',
    command: () => {
      confirmRemove()
    },
  },
])

const toggle = (event: Event) => {
  menu.value.toggle(event)
}

const confirmRemove = async () => {
  confirm.require({
    message: 'Are you sure you want to remove this user from organisation?',
    header: 'Danger zone',
    icon: 'pi pi-info-circle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Remove',
      severity: 'danger',
    },
    accept: async () => {
      await removeUser()
    },
    reject: () => {
      return
    },
  })
}

const selectUser = () => {
  if (user.value) {
    emit('onSelect', user.value.id)
  }
}

const removeUser = async () => {
  if (user.value) {
    emit('onRemove', user.value.id)
  }
}
</script>

<style></style>
