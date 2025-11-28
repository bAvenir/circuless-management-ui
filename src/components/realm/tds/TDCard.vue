
<template>
  <div
    class="w-full bg-white border rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row justify-between gap-4 hover:shadow-md transition"
  >
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-semibold">{{ td.title }}</h2>
      <h2 class="text-xl font-semibold">{{ td.description }}</h2>

      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="(action, name) in td.actions"
          :key="name"
          class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-lg"
        >
          {{ name }}
        </span>
      </div>
    </div>

    <div class="flex items-start gap-3 self-start lg:self-start">
        <Button v-if="!isDetailedTDRoute" @click="navigateTo(`/circuless/discovery/${id}`)" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700 transition">
          View Details
        </Button>

        <button v-if="isDetailedTDRoute" class="text-black text-sm transition items-start">
          ...
        </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThingDescription } from '~/api/realm/td';
import {Button} from "primevue"

const props = defineProps<{
  td: ThingDescription
}>()


const {td} = props.td
const id = props.td.id.toString();

const route = useRoute()

const isDetailedTDRoute = computed(() => {
  return route.name === 'circuless-discovery-id' && route.params.id === id
})


</script>
