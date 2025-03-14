<template>
  <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation partnerships" class="h-full grow">
    <RealmOraganisationAdminPartnerships />
  </Panel>
  <RealmOraganisationAdminPartnerships v-else />
</template>

<script lang="ts" setup></script>

<style></style>
