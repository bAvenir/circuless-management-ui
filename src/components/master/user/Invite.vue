<template>
  <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit" class="w-full h-full flex flex-col">
    <div class="grow w-full flex flex-col overflow-y-auto">
      <div class="flex flex-col gap-4 w-full h-full overflow-y-auto pb-8">
        <div class="w-full flex flex-col gap-1 pl-1">
          <label for="email">Email</label>
          <InputText id="email" name="email" type="text" placeholder="test@user.com" style="width: 216px" />
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{ $form.email.error?.message }}</Message>
        </div>
        <div class="w-full flex flex-col gap-1 pl-1">
          <label for="givenName">Name</label>
          <InputText id="givenName" name="givenName" type="text" placeholder="John" style="width: 216px" />
          <Message v-if="$form.givenName?.invalid" severity="error" size="small" variant="simple">{{ $form.givenName.error?.message }}</Message>
        </div>
        <div class="w-full flex flex-col gap-1 pl-1">
          <label for="familyName">Surname</label>
          <InputText id="familyName" name="familyName" type="text" placeholder="Doe" style="width: 216px" />
          <Message v-if="$form.familyName?.invalid" severity="error" size="small" variant="simple">{{ $form.familyName.error?.message }}</Message>
        </div>
        <div v-show="!organisation && avaliableRealms" class="w-full flex flex-col gap-1 pl-1">
          <label for="realm">Realm</label>
          <Select
            id="realm"
            name="realm"
            :options="avaliableRealms"
            v-model="selectedRealm"
            optionLabel="name"
            optionValue="code"
            filter
            placeholder="Select a realm..."
            style="width: 216px"
          />
          <Message v-if="$form.realm?.invalid" severity="error" size="small" variant="simple">{{ $form.realm.error?.message }}</Message>
        </div>
        <div v-show="!organisation && avaliableOrganisations && selectedRealm" class="w-full flex flex-col gap-1 pl-1">
          <label for="organisation">Organisation</label>
          <Select
            id="organisation"
            name="organisation"
            :options="avaliableOrganisations?.filter((o) => o.realm === selectedRealm) ?? []"
            optionLabel="name"
            optionValue="kcId"
            filter
            placeholder="Select an organisation..."
            style="width: 280px"
          />
          <Message v-if="$form.organisation?.invalid" severity="error" size="small" variant="simple">{{ $form.organisation.error?.message }}</Message>
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
import { miscTypes, type organisationTypes, type userTypes } from '~/shared/types'

type Error = {
  message: string
}

type Errors = {
  [key: string]: Error[]
}

const props = defineProps<{
  avaliableOrganisations?: organisationTypes.GetAllMaster
  organisation?: organisationTypes.GetMaster
  loading: boolean
}>()

const emit = defineEmits(['onSave', 'onCancel'])

const { loading } = toRefs(props)

const { organisation, avaliableOrganisations } = toRefs(props)

const avaliableRealms = ref(
  miscTypes.clientRealms.map((key) => ({
    name: key[0]?.toUpperCase() + key.slice(1),
    code: key,
  }))
)

const initialValues = reactive({
  email: '',
  givenName: '',
  familyName: '',
  realm: organisation.value?.realm ?? '',
  organisation: organisation.value?.kcId ?? '',
})

const selectedRealm = ref(organisation.value?.realm ?? '')

const resolver = (event: any) => {
  const errors: Errors = {}

  if (!event?.values?.email && event?.values?.email === '') {
    errors.email = [{ message: 'Email is required' }]
  }

  if (!event?.values?.givenName && event?.values?.givenName === '') {
    errors.givenName = [{ message: 'Name is required' }]
  }

  if (!event?.values?.familyName && event?.values?.familyName === '') {
    errors.familyName = [{ message: 'Surname is required' }]
  }

  if (!event?.values?.realm && event?.values?.realm === '') {
    errors.realm = [{ message: 'Realm is required' }]
  }

  if (!event?.values?.organisation && event?.values?.organisation === '') {
    errors.organisation = [{ message: 'Organisation is required' }]
  }

  return {
    errors,
  }
}

const onFormSubmit = async (event: any) => {
  if (event.valid) {
    const states = event.states!
    console.log('states', states)
    console.log('states.realm?.value', states.realm?.value)
    console.log('states.organisation?.value', states.organisation?.value)
    console.log('organisation.value?.realm', organisation.value?.realm)
    const data: userTypes.InviteBody = {
      email: states.email?.value,
      givenName: states.givenName?.value,
      familyName: states.familyName?.value,
      realm: states.realm?.value,
      kcOrganisationId: states.organisation?.value,
    }
    emit('onSave', data)
  }
}

const onCancel = () => {
  emit('onCancel')
}
</script>
