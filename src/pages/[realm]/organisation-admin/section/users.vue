<template>
  <div v-if="my" class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation users" class="w-full h-full flex flex-col">
      <RealmOraganisationAdminUsers :my="my.organisation" :loading="loading" />
    </Panel>
    <div v-else class="flex flex-col h-full w-full gap-5">
      <div class="font-medium">Organisation users</div>
      <RealmOraganisationAdminUsers :my="my.organisation" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRealmUserStore } from '~/stores/realm/user'

const realmUserStore = useRealmUserStore()

const { my, loading } = storeToRefs(realmUserStore)
</script>

<style>

</style>
