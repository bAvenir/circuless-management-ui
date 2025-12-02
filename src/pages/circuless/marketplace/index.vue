<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
      <p class="text-gray-600">Browse and discover available datasets in the collaboration catalogue</p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <div class="p-inputgroup">
          <InputText
            v-model="searchQuery"
            placeholder="Search datasets..."
            class="w-full rounded-lg
                   !bg-white !border-gray-300 !text-gray-900
                   placeholder:text-gray-400
                   focus:!border-cyan-400"
          />
          <Button
            icon="pi pi-search"
            class="!bg-cyan-500 !border-cyan-500 !text-white hover:!bg-cyan-600"
          />
        </div>
      </div>

      <!-- Category Filter -->
      <Dropdown
        v-model="selectedCategory"
        :options="categories"
        placeholder="All Categories"
        class="md:w-48 rounded-lg
               !bg-white !border-gray-300 !text-gray-900"
        showClear
      />

      <!-- Format Filter -->
      <Dropdown
        v-model="selectedFormat"
        :options="formats"
        placeholder="All Formats"
        class="md:w-48 rounded-lg
               !bg-white !border-gray-300 !text-gray-900"
        showClear
      />
    </div>

    <!-- Results Summary -->
    <div class="mb-6">
      <p class="text-sm text-gray-600">
        Showing {{ filteredDatasets.length }} of {{ all.length }} datasets
      </p>
    </div>

    <!-- DataView -->
    <DataView
      :value="filteredDatasets"
      :paginator="true"
      :rows="12"
      :sortOrder="sortOrder"
      :sortField="sortField"
      dataKey="id"
      class="circuless-dataview"
    >
      <!-- Sort Header -->
      <template #header>
        <div class="flex justify-end items-center">
          <Dropdown
            v-model="sortKey"
            :options="sortOptions"
            optionLabel="label"
            placeholder="Sort By"
            class="w-48 rounded-lg
                   !bg-white !border-gray-300 !text-gray-900"
            @change="onSortChange"
          />
        </div>
      </template>

      <!-- List Rendering -->
      <template #list="slotProps">
        <div v-for="dataset in slotProps.items" :key="dataset.id" class="col-12">

          <!-- Card -->
          <div
            class="dataset-card bg-white border border-gray-200
                   rounded-xl p-6 mb-6 shadow-sm
                   hover:shadow-md hover:border-cyan-300/50 transition-all"
          >
            <div class="flex flex-col lg:flex-row gap-6">

              <!-- Icon -->
              <div class="flex-shrink-0">
                <div
                  class="w-20 h-20 rounded-lg flex items-center justify-center
                         bg-cyan-50 border border-cyan-100"
                >
                  <i class="pi pi-database text-2xl text-cyan-600"></i>
                </div>
              </div>

              <!-- Main Content -->
              <div class="flex-1">
                <div class="flex flex-col lg:flex-row lg:justify-between gap-4">

                  <!-- Left: Title, desc, tags, metadata -->
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-900 mb-1">
                      {{ dataset.title }}
                    </h3>

                    <p class="text-gray-600 mb-3 line-clamp-2">
                      {{ dataset.description }}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span
                        v-for="tag in dataset.tags"
                        :key="tag"
                        class="px-2 py-1 rounded-md text-xs
                               bg-cyan-50 text-cyan-700
                               border border-cyan-200"
                      >
                        {{ tag }}
                      </span>
                    </div>

                    <!-- Metadata -->
                    <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        <i class="pi pi-calendar mr-1"></i>
                        Updated: {{ $formatDate(dataset.lastUpdated) }}
                      </span>

                      <span>
                        <i class="pi pi-download mr-1"></i>
                        {{ dataset.downloads }} downloads
                      </span>

                      <span>
                        <i class="pi pi-file mr-1"></i>
                        {{ dataset.format }}
                      </span>

                      <span>
                        <i class="pi pi-building mr-1"></i>
                        {{ dataset.organization }}
                      </span>
                    </div>
                  </div>

                  <!-- Right: Actions -->
                  <div class="flex flex-col gap-2 lg:w-40">
                    <Button
                      label="View Details"
                      icon="pi pi-eye"
                      size="small"
                      class="rounded-lg !bg-cyan-500 !border-cyan-500 !text-white hover:!bg-cyan-600"
                      @click="viewDataset(dataset)"
                    />

                    <Button
                      label="Download"
                      icon="pi pi-download"
                      size="small"
                      outlined
                      class="rounded-lg
                             !border-cyan-300 !text-cyan-700
                             hover:!bg-cyan-50"
                      @click="downloadDataset(dataset)"
                    />
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </template>
    </DataView>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useCirculessMarketplaceStore } from '~/stores/circuless/marketplace'

const circulessMarketplaceStore = useCirculessMarketplaceStore()

const { all, loading } = storeToRefs(circulessMarketplaceStore)

// POST TDS

const validTD = {
  title: "My Thing",
  version: { instance: "1.0.0" },
  description: "A sample Thing Description for testing",

  security: "nosec",
  securityDefinitions: {
    nosec: { scheme: "nosec" }
  },

  "@context": "https://www.w3.org/2022/wot/td/v1.1",

  properties: {},
  actions: {},
  events: {}
};

// Sorting
const sortField = ref('lastUpdated')
const sortOrder = ref(-1)
const sortKey = ref({ label: 'Most Recent', value: 'lastUpdated', order: -1 })

// Search and filters
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedFormat = ref(null)

// Sort options
const sortOptions = ref([
  { label: 'Most Recent', value: 'lastUpdated', order: -1 },
  { label: 'Oldest First', value: 'lastUpdated', order: 1 },
  { label: 'Most Popular', value: 'downloads', order: -1 },
  { label: 'Alphabetical', value: 'title', order: 1 },
])

// Filter options
const categories = ref(['Environment', 'Transportation', 'Health', 'Education', 'Government', 'Economy', 'Demographics', 'Infrastructure'])

const formats = ref(['CSV', 'JSON', 'XML', 'PDF', 'Excel', 'API', 'Shapefile', 'GeoJSON'])

// Computed filtered datasets
const filteredDatasets = computed(() => {
  let filtered = all.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (dataset) =>
        dataset.title.toLowerCase().includes(query) ||
        dataset.description.toLowerCase().includes(query) ||
        dataset.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        dataset.organization.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter((dataset) => dataset.category === selectedCategory.value)
  }

  // Apply format filter
  if (selectedFormat.value) {
    filtered = filtered.filter((dataset) => dataset.format === selectedFormat.value)
  }

  return filtered
})

await callOnce(async () => {
  await circulessMarketplaceStore.getAll()
})

// Methods
const onSortChange = (event: any) => {
  sortField.value = event.value.value
  sortOrder.value = event.value.order
}

const viewDataset = (dataset: any) => {
  // Navigate to dataset detail page
  navigateTo(`/circuless/marketplace/${dataset.id}`)
}

const downloadDataset = (dataset: any) => {
  // Handle dataset download
  console.log('Downloading dataset:', dataset.title)
  // You would implement actual download logic here
}
</script>

<style scoped></style>
