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
          <label for="domain">Domain</label>
          <InputText id="domain" name="domain" type="text" placeholder="bavenir.eu" style="width: 216px" />
          <Message v-if="$form.domain?.invalid" severity="error" size="small" variant="simple">{{ $form.domain.error?.message }}</Message>
        </div>
        <div class="w-full flex flex-col gap-1 pl-1">
          <label for="redirectUrl">Redirect url</label>
          <InputText id="redirectUrl" name="redirectUrl" type="text" placeholder="circuless.eu" style="width: 216px" />
          <Message v-if="$form.redirectUrl?.invalid" severity="error" size="small" variant="simple">{{ $form.redirectUrl.error?.message }}</Message>
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
      </div>
      <div class="flex justify-end gap-4 mt-4">
        <Button label="Cancel" @click="onCancel" severity="secondary" />
        <Button label="Save" type="submit" :loading="loading" />
      </div>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { miscTypes, type organisationTypes } from '~/shared/types'

type Error = {
  message: string
}

type Errors = {
  [key: string]: Error[]
}

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits(['onSave', 'onCancel'])

const { loading } = toRefs(props)

const avaliableRealms = ref(
  miscTypes.clientRealms.map((key) => ({
    name: key[0]?.toUpperCase() + key.slice(1),
    code: key,
  }))
)

const initialValues = reactive({
  name: '',
  domain: '',
  redirectUrl: '',
  realm: '',
})

const resolver = (event: any) => {
  const errors: Errors = {}

  if (!event?.values?.name && event?.values?.name === '') {
    errors.name = [{ message: 'Name is required' }]
  }

  if (!event?.values?.domain && event?.values?.domain === '') {
    errors.domain = [{ message: 'Domain is required' }]
  }

  if (!event?.values?.redirectUrl && event?.values?.redirectUrl === '') {
    errors.redirectUrl = [{ message: 'Redirect url is required' }]
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
    const data: organisationTypes.CreateBodyMaster = {
      name: states.name?.value,
      domain: states.domain?.value,
      redirectUrl: states.redirectUrl?.value,
      realm: states.realm?.value,
    }
    emit('onSave', data)
  }
}

const onCancel = () => {
  emit('onCancel')
}
</script>
