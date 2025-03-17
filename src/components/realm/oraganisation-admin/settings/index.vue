<template>
  <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="w-full h-full flex flex-col">
    <div class="grow w-full flex flex-col overflow-y-auto">
      <div class="flex flex-col gap-4 w-full h-full overflow-y-auto pb-8">
        <div class="w-full flex flex-col gap-1">
          <label for="name">Name</label>
          <InputText id="name" name="name" type="text" placeholder="bAvenir" style="width: 216px" />
          <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
          <Message v-else severity="secondary" size="small" variant="simple">alias: {{ my?.alias }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <Panel header="Identity">
            <div class="w-full flex gap-1">
              <label for="realm" class="text-realm-text-300">Realm:</label>
              <div>{{ my?.realm ?? 'No realm' }}</div>
            </div>
            <div class="w-full flex gap-1">
              <label for="realm" class="text-realm-text-300">Keycloak ID:</label>
              <div>{{ my?.kcId ?? 'No Keycloak ID' }}</div>
            </div>
          </Panel>
        </div>
      </div>
      <div class="flex justify-start items-end grow gap-4 mt-4">
        <Button label="Save" type="submit" :loading="loading" />
        <Button
          label="Cancel"
          @click="
            () => {
              $form.reset()
              onCancel()
            }
          "
          severity="secondary"
        />
      </div>
    </div>
  </Form>
</template>

<script lang="ts" setup>
import type { organisationTypes } from '~/shared/types'

type Error = {
  message: string
}

type Errors = {
  [key: string]: Error[]
}

const { my, loading } = defineProps<{
  my: organisationTypes.GetMyRealm
  loading: boolean
}>()

const emit = defineEmits(['onSave', 'onCancel'])

const initialValues = reactive({
  name: my?.name ?? '',
})

const resolver = (event: any) => {
  const errors: Errors = {}

  if (!event?.values?.name && event?.values?.name === '') {
    errors.name = [{ message: 'Name is required' }]
  }

  return {
    errors,
  }
}

const onFormSubmit = async (event: any) => {
  if (event.valid) {
    const states = event.states!
    const data: organisationTypes.UpdateBodyRealm = {
      name: states.name?.value,
    }
    emit('onSave', data)
  }
}

const onCancel = () => {
  emit('onCancel')
}
</script>

<style></style>
