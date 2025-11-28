<script lang="ts" setup>
import { useTDFilter } from '~/composables/useTDFilter'
import type { ThingDescription } from '~/api/realm/td'

const { items, selectedItemId } = defineProps<{
    items?: ThingDescription[]
    selectedItemId?: string
}>()

const emit = defineEmits(['onSelect', 'onDelete'])

const search = ref('')
const selectedType = ref('all')

const thingDescriptions = toRef(items ? { items } : { items: [] }, 'items')

const { filtered } = useTDFilter(
  thingDescriptions,
  search,
  selectedType
)

onMounted(() => {
    if (selectedItemId) {
        document.getElementById(selectedItemId)?.scrollIntoView({
            behavior: 'smooth',
        })
    }
})
</script>

<template>
    <div class="h-full w-full flex flex-col">
        <div class="pb-4 border-b border-slate-200 flex items-center gap-2 px-4 lg:px-0">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    type="text"
                    v-model="search"
                    placeholder="Search item..."
                />
            </IconField>
        </div>

        <div class="lg:grow w-full lg:overflow-y-auto">
            <div
                v-for="item in filtered"
                :key="item.id"
                :id="item.id"
                class="border-b border-slate-200 cursor-pointer hover:bg-realm-primary-100 transition-colors"
                :class="{ 'bg-realm-primary-100': item.id === selectedItemId }"
                @click="emit('onSelect', item.id)"
            >
                <RealmNodeAdminItemPreview :item="item" />
            </div>
        </div>
    </div>
</template>
