<template>
  <div>
    <Button icon="pi pi-ellipsis-h" size="small" outlined @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" :loading="loading" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<script setup lang="ts">
import type { organisationTypes } from '~/shared/types'

const confirm = useConfirm()
const menu = ref()

const props = defineProps<{
  organisation: organisationTypes.GetMaster
  loading: boolean
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const { loading } = toRefs(props)

const items = ref([
  {
    label: 'Open organisation detail',
    icon: 'pi pi-search',
    command: () => {
      selectOrganisation()
    },
  },
  {
    label: 'Delete organisation',
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
    message: 'Are you sure you want to delete this organisation?',
    header: 'Delete Confirmation',
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
      await deleteOrganisation()
    },
    reject: () => {
      return
    },
  })
}

const selectOrganisation = () => {
  const id = props.organisation?.id
  if (id) {
    emit('onSelect', id)
  }
}

const deleteOrganisation = async () => {
  const id = props.organisation?.id
  if (id) {
    emit('onDelete', id)
  }
}
</script>
