<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="w-44 h-full bg-realm-secondary-950 pt-4 flex flex-col">
    <RealmNodeAdminMenuNavButton icon="fa fa-cube" label="Items" :path="`${pathBase}/items`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-plug" label="Adapters" :path="`${pathBase}/adapters`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-file-signature" label="Contracts" :path="`${pathBase}/contracts`" />
    <div class="bg-white px-4 bg-opacity-20 flex items-center mt-10 opacity-80 text-xxs py-1 text-white font-semibold">Remote Infrastructure</div>
    <RealmNodeAdminMenuNavButton icon="fa fa-compass" label="Discovery" :path="`${pathBase}/discovery`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-key" label="Credentials" :path="`${pathBase}/credentials`" />
    <div class="w-full grow"></div>
    <RealmNodeAdminMenuNodeProfilePreview :my="my" />
  </div>
  <div v-else class="w-full h-12 xs:h-16 bg-realm-secondary-950 flex justify-center fixed lg:inherit bottom-0 left-0 z-50">
    <div class="grow h-full">
      <RealmNodeAdminMenuNodeProfilePreview :my="my" />
    </div>
    <RealmNodeAdminMenuNavButton icon="fa fa-cube" label="Items" :path="`${pathBase}/items`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-plug" label="Adapters" :path="`${pathBase}/adapters`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-file-signature" label="Contracts" :path="`${pathBase}/contracts`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-compass" label="Discovery" :path="`${pathBase}/discovery`" />
    <RealmNodeAdminMenuNavButton icon="fa fa-key" label="Credentials" :path="`${pathBase}/credentials`" />
    <div class="grow h-full"></div>
    <div v-if="$viewport.isGreaterThan('mobileWide')" class="w-10"></div>
  </div>
  <div v-if="$viewport.isLessOrEquals('tablet')" class="w-full h-12 xs:h-16" />
</template>

<script lang="ts" setup>
import type { nodeTypes } from '~/shared/types'

const realm = useRoute().params.realm as string
const id = useRoute().params.id as string

const { my } = defineProps<{
  my?: nodeTypes.GetMyRealm
}>()

const pathBase = `/${realm}/node-admin/${id}`
</script>

<style></style>
