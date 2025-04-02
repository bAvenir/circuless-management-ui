import type { ItemTD } from '@bavenir/spade-node-js-client'
import type { organisationTypes } from '.'

export interface ItemWithOrganisation extends ItemTD {
  organisation?: organisationTypes.GetRealm
}
