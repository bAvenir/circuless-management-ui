<template>
  <Dialog v-model:visible="visible" modal header="Add Node" :style="{ width: '32rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="flex flex-col gap-6 py-4">
      <!-- Node Name Field -->
      <div class="flex flex-col gap-2">
        <label for="nodeName" class="font-semibold">Node Name</label>
        <InputText id="nodeName" v-model="nodeData.name" placeholder="Enter node name" :class="{ 'p-invalid': errors.name }" />
        <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
      </div>

      <!-- DNS Field -->
      <div class="flex flex-col gap-2">
        <label for="nodeHost" class="font-semibold">Host</label>
        <InputText id="nodeHost" v-model="nodeData.host" placeholder="Enter host address" :class="{ 'p-invalid': errors.host }" />
        <small v-if="errors.host" class="text-red-500">{{ errors.host }}</small>
      </div>

      <!-- Certificate Info -->
      <div class="flex flex-col gap-3">
        <label class="font-semibold">Client Certificate</label>
        <div class="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <i class="pi pi-info-circle text-blue-600 mr-2"></i>
          <span class="text-blue-800">A client certificate will be generated automatically when you add the node.</span>
        </div>
        <div v-if="certificateData" class="flex gap-2">
          <Button label="Download Certificate" icon="pi pi-download" severity="success" @click="downloadCertificate" />
        </div>
        <div v-if="certificateData" class="p-3 bg-green-50 border border-green-200 rounded-md">
          <i class="pi pi-check-circle text-green-600 mr-2"></i>
          <span class="text-green-800">Node created and certificate generated successfully!</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" icon="pi pi-times" text @click="closeDialog" />
        <Button
          v-if="!certificateData"
          label="Add Node & Generate Certificate"
          icon="pi pi-plus"
          :loading="saving"
          :disabled="!isFormValid"
          @click="addNode"
        />
        <Button v-else label="Close" icon="pi pi-check" severity="success" @click="closeDialog" />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { Realm } from '@prisma/client'
import { useRealmNodeStore } from '~/stores/realm/node'

const props = defineProps<{
  realm: Realm
}>()

interface NodeData {
  name: string
  host: string
}

interface CertificateData {
  certificate: string
  privateKey: string
  filename: string
}

const realmNodeStore = useRealmNodeStore()
const visible = defineModel<boolean>('visible', { default: false })
const toast = useToastService()

const emit = defineEmits<{
  nodeAdded: [node: NodeData & { certificate: CertificateData }]
}>()

// Reactive data
const nodeData = reactive<NodeData>({
  name: '',
  host: '',
})

const errors = reactive({
  name: '',
  host: '',
})

const saving = ref(false)
const certificateData = ref<CertificateData | null>(null)

// Computed properties
const isFormValid = computed(() => {
  return nodeData.name.trim() !== '' && nodeData.host.trim() !== '' && !errors.name && !errors.host
})

// Methods
const validateForm = () => {
  errors.name = ''
  errors.host = ''

  if (!nodeData.name.trim()) {
    errors.name = 'Node name is required'
  }

  if (!nodeData.host.trim()) {
    errors.host = 'Host is required'
  } else if (!isValidHost(nodeData.host)) {
    errors.host = 'Please enter a valid host address'
  }

  return !errors.name && !errors.host
}

const isValidHost = (host: string) => {
  // Basic host validation - you can make this more sophisticated
  const hostRegex = /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
  return hostRegex.test(host.trim())
}

const addNode = async () => {
  if (!validateForm()) return

  saving.value = true

  try {
    const response = await realmNodeStore.create(props.realm, {
      name: nodeData.name,
      host: nodeData.host,
    })

    const generatedCertificate: CertificateData = {
      certificate: response.certificate,
      privateKey: response.privateKey,
      filename: `${response.node.name.toLowerCase().replace(/\s+/g, '-')}-certificate.pem`,
    }

    certificateData.value = generatedCertificate

    const nodeToAdd = {
      ...response.node,
      certificate: generatedCertificate,
    }

    emit('nodeAdded', nodeToAdd)
  } catch (error) {
    toast.predefined.node.created.error(error)
  } finally {
    saving.value = false
  }
}

const downloadCertificate = () => {
  if (!certificateData.value) return

  const content = `${certificateData.value.certificate}\n${certificateData.value.privateKey}`
  const blob = new Blob([content], { type: 'application/x-pem-file' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = certificateData.value.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

const closeDialog = () => {
  visible.value = false
  resetForm()
}

const resetForm = () => {
  nodeData.name = ''
  nodeData.host = ''
  errors.name = ''
  errors.host = ''
  certificateData.value = null
}

// Watch for dialog visibility changes to reset form
watch(visible, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>

<style scoped>
.p-invalid {
  border-color: #ef4444;
}
</style>
