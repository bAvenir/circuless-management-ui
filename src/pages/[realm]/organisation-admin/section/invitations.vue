<template>
  <div class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation invitations" class="h-full grow">
      <RealmOraganisationAdminInvitations />
    </Panel>
    <RealmOraganisationAdminInvitations v-else />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
