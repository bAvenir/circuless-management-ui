import type { Realm } from '@prisma/client'
import { TDsManagement, type ThingDescription } from '~/api/realm/td'
import type { nodeTypes } from '~/shared/types'

export const useRealmNodeStore = defineStore('realmNodeStore', () => {
  const loading = ref(false)

  const allMy = ref<nodeTypes.GetAllMyRealm>([])
  const my = ref<nodeTypes.GetMyRealm | undefined>(undefined)

  const allMyItems = ref<ThingDescription[] | undefined>(undefined)
  const myItem = ref<ThingDescription | undefined>(undefined)

  const currentRealm = ref<Realm | null>(null)
  const currentNodeId = ref<string | null>(null)

  async function create(realm: Realm, data: nodeTypes.CreateBodyRealm) {
    try {
      loading.value = true
      const node = await api.node.realm.create(realm, data)
      console.log('node:', node)
      allMy.value.push(node.node)
      return node
    } finally {
      loading.value = false
    }
  }

  async function getAllMy(realm: Realm) {
    try {
      loading.value = true
      const nodes = await api.node.realm.getAllMy(realm)
      allMy.value = nodes
      console.log('nodes:', nodes)
      return nodes
    } finally {
      loading.value = false
    }
  }

  async function getMy(id: string, realm: Realm) {
    try {
      loading.value = true
      const node = await api.node.realm.getMy(id, realm)
      my.value = node
      console.log('node:', node)
      return node
    } finally {
      loading.value = false
    }
  }

  async function getMyItems(realm: Realm, nodeId: string) {
    try {
      loading.value = true

      currentRealm.value = realm
      currentNodeId.value = nodeId

      const items = await TDsManagement.getAllTDs(realm, nodeId)

      allMyItems.value = items
      console.log('items', items)

      return items
    } finally {
      loading.value = false
    }
  }

  async function getMyItem(itemId: string) {
    try {
      loading.value = true

      if (!currentRealm.value || !currentNodeId.value) {
        throw new Error('Realm or Node ID not set before calling getMyItem()')
      }
      const item = await TDsManagement.getTDDetails(
        currentRealm.value,
        currentNodeId.value,
        itemId
      )
      console.log('item:',item)
      myItem.value = item
      return item
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    allMy,
    my,
    allMyItems,
    myItem,
    create,
    getAllMy,
    getMy,
    getMyItems,
    getMyItem,
  }
})
