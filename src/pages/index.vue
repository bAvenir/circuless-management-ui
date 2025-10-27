<template>
  <div class="w-full h-full flex items-center justify-center">
    <Card>
      <template #title> Realms </template>
      <template #content>
        <div class="flex flex-col gap-2 w-full">
          <NuxtLink to="/master" class="w-full">
            <Button class="w-full">Master</Button>
          </NuxtLink>
          <NuxtLink to="/circuless/marketplace" class="w-full">
            <Button class="w-full">Circuless</Button>
          </NuxtLink>
        </div>
      </template>
      <template #footer>
        <div class="text-sm text-slate-400">© 2025 bAvenir. All rights reserved.</div>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
