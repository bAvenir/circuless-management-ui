import type { Realm } from '@prisma/client'

export interface FetchThingDescription {
    id: number | string
    oid: string
    td: {
        title?: string
        description?: string | null
        oid?: string
        actions?: Record<string, any>
        events?: ThingDescriptionEvent
        properties: ThingDescriptionProperty
        '@type'?: string | string[]
    }
}

export interface PostThingDescription {
  title: string,
  description: string,
  properties: Record<string, any>,
  actions: Record<string, any>,
  events: Record<string, any>

}

export type ThingDescriptionEvent = Record<string, any>
export type ThingDescriptionProperty = Record<string, any>

export const TDsManagement = {
    async postTD(realm: Realm, nodeId: string, TD: PostThingDescription) {
            console.log('HASTA AQUI 3:', )
        return await $fetch(
            `/api/realm/${realm}/node/my/${nodeId}/items`,
            {
                method: 'POST' as any,
                body: TD,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    },

    async getAllTDs(realm: Realm, nodeId: string) {
        return $fetch<FetchThingDescription[]>(`/api/realm/${realm}/node/my/${nodeId}/items`, {
            method: 'GET',
        })

    },

    async getTDDetails(realm: Realm, nodeId: string, itemID: string) {
        return $fetch<FetchThingDescription>(
            `/api/realm/${realm}/node/my/${nodeId}/items/${itemID}`,
            {
                method: 'GET',
            }
        )
    },

    async deleteTD(realm: Realm, nodeId: string, itemID: string) {
        return $fetch(
            `/api/realm/${realm}/node/my/${nodeId}/items/${itemID}`,
            {
                method: 'DELETE' as any,
            }
        )
    },

   async updateTD(realm: Realm, nodeId: string, itemID: string, data: any) {
        return $fetch(
            `/api/realm/${realm}/node/my/${nodeId}/items/${itemID}`,
            {
                method: 'PATCH' as any,
                body: data,
            }
        )
    }
}
