<template>
  <div>
    <Button icon="pi pi-ellipsis-h" size="small" outlined @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" :loading="loading" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<script lang="ts" setup>
import type { partnershipTypes } from '~/shared/types'

const props = defineProps<{
  partnership: partnershipTypes.GetMyIngress | partnershipTypes.GetMyEgress
  loading: boolean
}>()

const confirm = useConfirm()
const menu = ref()

const { partnership, loading } = toRefs(props)

const emit = defineEmits(['onSelect', 'onDelete'])

const items = ref([
  // {
  //   label: 'Open detail',
  //   icon: 'pi pi-search',
  //   command: () => {
  //     selectPartnership()
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
    message: 'Are you sure you want to delete this partnership?',
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
      await deletePartnership()
    },
    reject: () => {
      return
    },
  })
}

const selectPartnership = () => {
  if (partnership.value) {
    emit('onSelect', partnership.value)
  }
}

const deletePartnership = async () => {
  if (partnership.value) {
    emit('onDelete', partnership.value)
  }
}
</script>

<style></style>
