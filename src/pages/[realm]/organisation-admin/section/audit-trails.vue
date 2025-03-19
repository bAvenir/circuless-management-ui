<template>
  <div class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation audit trails" class="h-full grow">
      <RealmOraganisationAdminAuditTrails />
    </Panel>
    <RealmOraganisationAdminAuditTrails v-else />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
