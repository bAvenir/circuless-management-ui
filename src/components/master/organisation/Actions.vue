<template>
  <!-- <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(organisation?.id ?? '')"> Copy organisation ID </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>View organisation</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu> -->
</template>

<script lang="ts" setup>
import type { organisationTypes } from '~/shared/types'

defineProps<{
  organisation: organisationTypes.GetMaster
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
</script>

<style></style>
