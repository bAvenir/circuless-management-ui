<template>
  <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation invitations" class="h-full grow">
    <RealmOraganisationAdminInvitations />
  </Panel>
  <RealmOraganisationAdminInvitations v-else />
</template>

<script lang="ts" setup></script>

<style></style>
