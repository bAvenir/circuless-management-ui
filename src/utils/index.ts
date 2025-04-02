import type { ItemTD } from '@bavenir/spade-node-js-client'
import { itemTypes } from '~/misc'

export function getItemMetaData(item?: ItemTD) {
  if (!item) return itemTypes[0]
  const itemType = item['@type']?.at(0)?.replace('adp:', '') || item['@type']?.at(0)
  return itemTypes.find((type) => type.title === itemType) || itemTypes[0]
}
