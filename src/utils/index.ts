import type { ItemTD } from '@bavenir/spade-node-js-client'
import type { ThingDescription } from '~/api/realm/td'
import { itemTypes } from '~/misc'

export function getItemMetaData(item?: ThingDescription) {
  if (!item) return itemTypes[0]
  const itemType = item.td?.['@type']?.at(0)?.replace('adp:', '') || item.td?.['@type']?.at(0)
  return itemTypes.find((type) => type.title === itemType) || itemTypes[0]
}
