import type { Realm } from '@prisma/client'

export interface ThingDescription {
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

export type ThingDescriptionEvent = Record<string, any>
export type ThingDescriptionProperty = Record<string, any>

export const TDsManagement = {
    async postTD(realm: Realm, id: string, TD: ThingDescription) {
        const instructions = await $fetch(
            `/api/${realm}/node-admin/${id}/items`,
            {
                method: 'POST' as any,
                body: TD,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return instructions
    },

    async getAllTDs(realm: Realm, id: string) {
        return $fetch<ThingDescription[]>(`/api/${realm}/node/my/${id}/items`, {
            method: 'GET',
        })
    },
    async getTDDetails(realm: Realm, id: string, itemID: string) {
        return $fetch<ThingDescription>(
            `/api/${realm}/node/my/${id}/items/${itemID}`,
            {
                method: 'GET',
            }
        )
    },
}
