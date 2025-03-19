<template>
  <div class="w-full h-full">
    <Panel v-if="$viewport.isGreaterThan('tablet')" header="Organisation partnerships" class="h-full grow">
      <RealmOraganisationAdminPartnerships />
    </Panel>
    <RealmOraganisationAdminPartnerships v-else />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
