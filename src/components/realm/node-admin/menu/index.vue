<template>
  <div v-if="$viewport.isGreaterThan('tablet')" class="w-44 h-full bg-realm-secondary-950 pt-4">
    <RealmNodeAdminMenuNavButton icon="fa fa-cube" label="Items" active />
    <RealmNodeAdminMenuNavButton icon="fa fa-plug" label="Adapters" />
    <RealmNodeAdminMenuNavButton icon="fa fa-file-signature" label="Contracts" />
    <div class="bg-white px-4 bg-opacity-20 flex items-center mt-10 opacity-80 text-xxs py-1 text-white font-semibold">Remote Infrastructure</div>
    <RealmNodeAdminMenuNavButton icon="fa fa-compass" label="Discovery" />
    <RealmNodeAdminMenuNavButton icon="fa fa-key" label="Credentials" />
  </div>
  <div v-else class="w-full h-16 bg-realm-secondary-950 flex justify-center">
    <RealmNodeAdminMenuNavButton icon="fa fa-cube" label="Items" active />
    <RealmNodeAdminMenuNavButton icon="fa fa-plug" label="Adapters" />
    <RealmNodeAdminMenuNavButton icon="fa fa-file-signature" label="Contracts" />
    <RealmNodeAdminMenuNavButton icon="fa fa-compass" label="Discovery" />
    <RealmNodeAdminMenuNavButton icon="fa fa-key" label="Credentials" />
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
