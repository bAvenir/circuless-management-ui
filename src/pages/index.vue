<template>
  <div class="w-full h-full flex items-center justify-center">
    <Card>
      <template #content>
        <div class="flex flex-col gap-2 w-full">
          <h2>Realms</h2>
          <NuxtLink to="/master" class="w-full">
            <Button class="w-full">Master</Button>
          </NuxtLink>
          <NuxtLink to="/circuless" class="w-full">
            <Button class="w-full">Circuless</Button>
          </NuxtLink>
          <h2 class="mt-2">Docs</h2>
          <a href="/_swagger" class="w-full">
            <Button class="w-full">Swagger</Button>
          </a>
          <a href="/_scalar" class="w-full">
            <Button class="w-full">Scalar</Button>
          </a>
          <a href="/_openapi.json" class="w-full">
            <Button class="w-full">OpenApi</Button>
          </a>
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
