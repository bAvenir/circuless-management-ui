<template>
  <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation users" class="h-full grow">
    <RealmOraganisationAdminUsers />
  </Panel>
  <RealmOraganisationAdminUsers v-else />
</template>

<script lang="ts" setup></script>

<style></style>
