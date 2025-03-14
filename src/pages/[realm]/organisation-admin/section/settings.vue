<template>
  <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation settings" class="h-full grow">
    <RealmOraganisationAdminSettings />
  </Panel>
  <RealmOraganisationAdminSettings v-else />
</template>

<script lang="ts" setup></script>

<style></style>
