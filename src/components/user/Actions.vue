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
      <DropdownMenuItem @click="copy(user?.id ?? '')"> Copy user ID </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>View user</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu> -->
</template>

<script lang="ts" setup>
import type { userTypes } from '~/shared/types'

defineProps<{
  user: userTypes.GetMaster
}>()

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
</script>

<style></style>
