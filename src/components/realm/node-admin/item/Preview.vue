<template>
    <div class="w-full py-5 px-4 flex items-center gap-4">
        <div
            class="size-6 bg-lightBrown text-white rounded-md flex items-center justify-center text-xs shrink-0"
        >
            <font-awesome-icon icon="fa fa-cube" />
        </div>
        <div class="grow flex flex-col gap-1 min-w-56">
            <div class="font-semibold text-sm text-realm-text-600">
                {{ item?.td?.title }}
            </div>
            <RealmNodeAdminItemType
                :item="item"
                class="text-xs text-realm-text-300"
            />
        </div>
        <div class="text-xs text-realm-text-300 shrink-0">
            <div>{{ props.length ?? 0 }} properties</div>
            <div>0 events</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FetchThingDescription } from '~/api/realm/td'

const { item } = defineProps<{
    item?: FetchThingDescription
}>()

const { properties } = item?.td ?? {}

const props = Object.keys(properties ?? {})
</script>

<style></style>
