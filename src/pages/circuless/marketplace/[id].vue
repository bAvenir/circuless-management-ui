<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <Breadcrumb :model="breadcrumbItems" class="mb-6" />

    <div v-if="one" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2">
        <!-- Dataset Header -->
        <div class="mb-8">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i class="pi pi-database text-2xl text-blue-600"></i>
            </div>
            <div class="flex-1">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ one.title }}</h1>
              <p class="text-gray-600 mb-4">{{ one.description }}</p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <Tag v-for="tag in one.tags" :key="tag" :value="tag" severity="info" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <TabView>
          <TabPanel header="Overview" value="overview">
            <div class="space-y-6">
              <!-- Description -->
              <div>
                <h3 class="text-lg font-semibold mb-3">Description</h3>
                <p class="text-gray-700 leading-relaxed">
                  {{ one.description }}
                </p>
                <p class="text-gray-700 leading-relaxed mt-4">
                  This dataset provides comprehensive information that can be used for research, analysis, and decision-making purposes. The data is
                  regularly updated to ensure accuracy and relevance.
                </p>
              </div>

              <!-- Data Structure -->
              <div>
                <h3 class="text-lg font-semibold mb-3">Data Structure</h3>
                <div class="border rounded-lg overflow-hidden">
                  <table class="w-full">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Field</th>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                        <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="field in dataStructure" :key="field.name">
                        <td class="px-4 py-3 text-sm font-mono text-gray-900">{{ field.name }}</td>
                        <td class="px-4 py-3 text-sm text-gray-600">{{ field.type }}</td>
                        <td class="px-4 py-3 text-sm text-gray-700">{{ field.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Sample Data -->
              <div>
                <h3 class="text-lg font-semibold mb-3">Sample Data</h3>
                <div class="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                  <pre class="text-sm"><code>{{ sampleData }}</code></pre>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="API Documentation" value="api">
            <div class="space-y-6">
              <!-- API Endpoints -->
              <div>
                <h3 class="text-lg font-semibold mb-3">API Endpoints</h3>
                <div class="space-y-4">
                  <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <Badge value="GET" severity="success" />
                      <code class="text-sm font-mono">/api/datasets/{{ one.id }}</code>
                    </div>
                    <p class="text-sm text-gray-600">Retrieve complete dataset information</p>
                  </div>

                  <div class="border rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <Badge value="GET" severity="success" />
                      <code class="text-sm font-mono">/api/datasets/{{ one.id }}/download</code>
                    </div>
                    <p class="text-sm text-gray-600">Download dataset in specified format</p>
                  </div>
                </div>
              </div>

              <!-- Code Examples -->
              <div>
                <h3 class="text-lg font-semibold mb-3">Code Examples</h3>
                <TabView>
                  <TabPanel header="cURL" value="curl">
                    <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre class="text-green-400 text-sm"><code>curl -X GET "https://api.example.com/datasets/{{ one.id }}" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY"</code></pre>
                    </div>
                  </TabPanel>

                  <TabPanel header="JavaScript" value="javascript">
                    <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre class="text-green-400 text-sm"><code>fetch('https://api.example.com/datasets/{{ one.id }}', {
  headers: {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));</code></pre>
                    </div>
                  </TabPanel>

                  <TabPanel header="Python" value="python">
                    <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre class="text-green-400 text-sm"><code>import requests

headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(
    'https://api.example.com/datasets/{{ one.id }}',
    headers=headers
)
data = response.json()</code></pre>
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Usage & Licensing" value="licensing">
            <div class="space-y-6">
              <!-- License Information -->
              <div>
                <h3 class="text-lg font-semibold mb-3">License</h3>
                <div class="border rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <i class="pi pi-shield text-green-600"></i>
                    <span class="font-medium">{{ one.license }}</span>
                  </div>
                  <p class="text-sm text-gray-600">
                    This dataset is available under the {{ one.license }} license. You are free to use, modify, and distribute this data with proper
                    attribution.
                  </p>
                </div>
              </div>

              <!-- Usage Guidelines -->
              <div>
                <h3 class="text-lg font-semibold mb-3">Usage Guidelines</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li>Always provide proper attribution when using this dataset</li>
                  <li>Check for updates regularly as data may be refreshed</li>
                  <li>Respect any rate limits when accessing via API</li>
                  <li>Report any data quality issues to the organization</li>
                </ul>
              </div>

              <!-- Citation -->
              <div>
                <h3 class="text-lg font-semibold mb-3">How to Cite</h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm font-mono">
                    {{ one.organization }}. ({{ new Date(one.lastUpdated).getFullYear() }}). {{ one.title }}. Retrieved from
                    https://collaboration-catalogue.example.com/datasets/{{ one.id }}
                  </p>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="space-y-6">
          <!-- Quick Actions -->
          <Card>
            <template #title>Quick Actions</template>
            <template #content>
              <div class="space-y-3">
                <Button label="Download Dataset" icon="pi pi-download" class="w-full" @click="downloadDataset" />
                <Button label="View in API Explorer" icon="pi pi-code" severity="secondary" outlined class="w-full" />
                <Button label="Subscribe to Updates" icon="pi pi-bell" severity="info" outlined class="w-full" />
              </div>
            </template>
          </Card>

          <!-- Metadata -->
          <Card>
            <template #title>Metadata</template>
            <template #content>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">Organization</label>
                  <p class="text-sm">{{ one.organization }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Format</label>
                  <p class="text-sm">{{ one.format }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Size</label>
                  <p class="text-sm">{{ one.size }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Last Updated</label>
                  <p class="text-sm">{{ $formatDate(one.lastUpdated, { month: 'long' }) }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">Downloads</label>
                  <p class="text-sm">{{ one.downloads.toLocaleString() }}</p>
                </div>

                <div>
                  <label class="text-sm font-medium text-gray-600">License</label>
                  <p class="text-sm">{{ one.license }}</p>
                </div>
              </div>
            </template>
          </Card>

          <!-- Related Datasets -->
          <Card>
            <template #title>Related Datasets</template>
            <template #content>
              <div class="space-y-3">
                <div
                  v-for="related in relatedDatasets"
                  :key="related.id"
                  class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="navigateTo(`/circuless/datasets/${related.id}`)"
                >
                  <h4 class="text-sm font-medium text-gray-900 mb-1">{{ related.title }}</h4>
                  <p class="text-xs text-gray-600">{{ related.organization }}</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Dataset not found -->
    <div v-else class="text-center py-12">
      <i class="pi pi-exclamation-triangle text-4xl text-gray-400 mb-4"></i>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Dataset Not Found</h2>
      <p class="text-gray-600 mb-6">The requested dataset could not be found.</p>
      <Button label="Back to Catalog" icon="pi pi-arrow-left" @click="navigateTo('/circuless')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useCirculessMarketplaceStore } from '~/stores/circuless/marketplace'

const route = useRoute()
const circulessMarketplaceStore = useCirculessMarketplaceStore()

const id = ref(route.params.id as string)
const { all, one, loading } = storeToRefs(circulessMarketplaceStore)

await callOnce(async () => {
  await circulessMarketplaceStore.get(id.value)
})

// Breadcrumb
const breadcrumbItems = ref([{ label: 'Circuless', route: '/circuless' }, { label: 'Datasets', route: '/circuless' }, { label: 'Dataset Detail' }])

// Sample data structure for the current dataset
const dataStructure = [
  { name: 'station_id', type: 'String', description: 'Unique identifier for monitoring station' },
  { name: 'timestamp', type: 'DateTime', description: 'Date and time of measurement' },
  { name: 'pm25', type: 'Float', description: 'PM2.5 concentration in μg/m³' },
  { name: 'pm10', type: 'Float', description: 'PM10 concentration in μg/m³' },
  { name: 'no2', type: 'Float', description: 'NO2 concentration in μg/m³' },
  { name: 'so2', type: 'Float', description: 'SO2 concentration in μg/m³' },
  { name: 'o3', type: 'Float', description: 'O3 concentration in μg/m³' },
  { name: 'latitude', type: 'Float', description: 'Station latitude coordinate' },
  { name: 'longitude', type: 'Float', description: 'Station longitude coordinate' },
]

// Sample data
const sampleData = `{
  "station_id": "EPA_001",
  "timestamp": "2024-10-15T14:00:00Z",
  "pm25": 12.5,
  "pm10": 18.3,
  "no2": 25.7,
  "so2": 8.1,
  "o3": 45.2,
  "latitude": 40.7128,
  "longitude": -74.0060
}`

// Related datasets
const relatedDatasets = computed(() => {
  return all.value.filter((d) => d.id !== one.value?.id).slice(0, 3)
})

// Methods
const downloadDataset = () => {
  console.log('Downloading dataset:', one.value?.title)
  // Implement download logic
}

// Set page title
onMounted(() => {
  if (one.value) {
    useHead({
      title: `${one.value.title} - Dataset Catalog`,
    })
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
