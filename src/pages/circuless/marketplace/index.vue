<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Marketplace</h1>
      <p class="text-gray-600">Browse and discover available datasets in the collaboration catalogue</p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="p-inputgroup">
          <InputText v-model="searchQuery" placeholder="Search datasets..." class="w-full" />
          <Button icon="pi pi-search" severity="secondary" />
        </div>
      </div>
      <Dropdown v-model="selectedCategory" :options="categories" placeholder="All Categories" class="md:w-48" showClear />
      <Dropdown v-model="selectedFormat" :options="formats" placeholder="All Formats" class="md:w-48" showClear />
    </div>

    <!-- Results Summary -->
    <div class="mb-6">
      <p class="text-sm text-gray-600">Showing {{ filteredDatasets.length }} of {{ all.length }} datasets</p>
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
      <template #header>
        <div class="flex justify-between items-center">
          <div></div>
          <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By" class="w-48" @change="onSortChange" />
        </div>
      </template>

      <template #list="slotProps">
        <div v-for="dataset in slotProps.items" :key="dataset.id" class="col-12">
          <div class="border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition-shadow">
            <div class="flex flex-col lg:flex-row gap-6">
              <!-- Dataset Icon/Image -->
              <div class="flex-shrink-0">
                <div class="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-database text-2xl text-blue-600"></i>
                </div>
              </div>

              <!-- Main Content -->
              <div class="flex-1">
                <div class="flex flex-col lg:flex-row lg:justify-between gap-4">
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">
                      {{ dataset.title }}
                    </h3>
                    <p class="text-gray-600 mb-3 line-clamp-2">
                      {{ dataset.description }}
                    </p>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mb-3">
                      <Tag v-for="tag in dataset.tags" :key="tag" :value="tag" severity="info" class="text-xs" />
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

                  <!-- Actions -->
                  <div class="flex flex-col gap-2 lg:w-32">
                    <Button label="View Details" icon="pi pi-eye" size="small" @click="viewDataset(dataset)" />
                    <Button label="Download" icon="pi pi-download" severity="secondary" size="small" outlined @click="downloadDataset(dataset)" />
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
