<template>
  <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="w-full h-full flex flex-col">
    <div class="grow w-full flex flex-col overflow-y-auto">
      <div class="flex flex-col gap-4 w-full h-full overflow-y-auto pb-8">
        <div class="w-full flex flex-col gap-1 pl-1">
          <label for="name">Name</label>
          <InputText id="name" name="name" type="text" placeholder="bAvenir" style="width: 216px" />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
        </div>
        <div class="w-full flex flex-col gap-1 pl-1">
          <label for="host">Host</label>
          <InputText id="host" name="host" type="text" placeholder="bavenir.eu" style="width: 216px" />
          <Message v-if="$form.host?.invalid" severity="error" size="small" variant="simple">{{ $form.host.error?.message }}</Message>
        </div>
        <div v-if="avaliableRealms" class="w-full flex flex-col gap-1 pl-1">
          <label for="realm">Realm</label>
          <Select
            id="realm"
            name="realm"
            :options="avaliableRealms"
            optionLabel="name"
            optionValue="code"
            filter
            placeholder="Select a realm..."
            style="width: 216px"
          />
          <Message v-if="$form.realm?.invalid" severity="error" size="small" variant="simple">{{ $form.realm.error?.message }}</Message>
        </div>
        <div v-if="avaliableRoles" class="w-full flex flex-col gap-1 pl-1">
          <label for="roles">Roles</label>
          <MultiSelect
            id="roles"
            name="roles"
            :options="avaliableRoles"
            optionLabel="name"
            optionValue="code"
            filter
            placeholder="Select a roles..."
            style="width: 216px"
          />
          <Message v-if="$form.roles?.invalid" severity="error" size="small" variant="simple">{{ $form.roles.error?.message }}</Message>
        </div>
        <div v-if="avaliableAccess" class="w-full flex flex-col gap-1 pl-1">
          <label for="access">Access</label>
          <SelectButton id="access" name="access" :options="avaliableAccess" optionLabel="name" optionValue="code" :allowEmpty="false" />
          <Message v-if="$form.access?.invalid" severity="error" size="small" variant="simple">{{ $form.access.error?.message }}</Message>
        </div>
      </div>
      <div v-if="!alignActions || alignActions === 'end'" class="flex justify-end gap-4 mt-4">
        <Button label="Cancel" @click="onCancel" severity="secondary" />
        <Button :label="saveLabel ?? 'Save'" type="submit" :loading="loading" />
      </div>
      <div v-if="alignActions === 'start'" class="flex justify-start gap-4 mt-4">
        <Button :label="saveLabel ?? 'Save'" type="submit" :loading="loading" />
        <Button label="Cancel" @click="onCancel" severity="secondary" />
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { NodeAccess } from '@prisma/client'
import { miscTypes, nodeTypes } from '~/shared/types'

type Error = {
  message: string
}

type Errors = {
  [key: string]: Error[]
}

const props = defineProps<{
  loading: boolean
  saveLabel?: string
  alignActions?: 'start' | 'end'
}>()

const emit = defineEmits(['onSave', 'onCancel'])

const { loading } = toRefs(props)

const avaliableRealms = ref(
  miscTypes.clientRealms.map((key) => ({
    name: key[0]?.toUpperCase() + key.slice(1),
    code: key,
  }))
)

const avaliableAccess = ref(
  nodeTypes.nodeAccess.map((key) => ({
    name: key[0]?.toUpperCase() + key.slice(1),
    code: key,
  }))
)

const avaliableRoles = ref(
  nodeTypes.nodeRole.map((key) => ({
    name: key[0]?.toUpperCase() + key.slice(1),
    code: key,
  }))
)

const initialValues = reactive({
  name: '',
  host: '',
  access: NodeAccess.direct,
  roles: [],
  ownerId: '',
  realm: '',
})

const resolver = (event: any) => {
  const errors: Errors = {}

  if (!event?.values?.name && event?.values?.name === '') {
    errors.name = [{ message: 'Name is required' }]
  }

  if (!event?.values?.host && event?.values?.host === '') {
    errors.host = [{ message: 'Host is required' }]
  }

  if (!event?.values?.access && event?.values?.access === '') {
    errors.access = [{ message: 'Access is required' }]
  }

  if (!event?.values?.roles && event?.values?.roles.length === 0) {
    errors.roles = [{ message: 'Roles are required' }]
  }

  if (!event?.values?.ownerId && event?.values?.ownerId === '') {
    errors.ownerId = [{ message: 'Owner is required' }]
  }

  if (!event?.values?.realm && event?.values?.realm === '') {
    errors.realm = [{ message: 'Realm is required' }]
  }

  return {
    errors,
  }
}

const onFormSubmit = async (event: any) => {
  if (event.valid) {
    const states = event.states!
    const data: nodeTypes.CreateBody = {
      name: states.name?.value,
      host: states.host?.value,
      access: states.access?.value,
      roles: states.roles?.value,
      ownerId: states.ownerId?.value,
      realm: states.realm?.value,
    }
    emit('onSave', data)
  }
}

const onCancel = () => {
  emit('onCancel')
}
</script>
