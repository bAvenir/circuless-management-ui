import { MasterAuthApi } from '~/api/master/auth'
import { RealmAuthApi } from '~/api/realm/auth'
import { RealmUserApi } from '~/api/realm/user'
import { MasterOrganisationApi } from '~/api/master/organisation'
import { MasterUserApi } from '~/api/master/user'
import { RealmOrganisationApi } from '~/api/realm/organisation'
import { RealmPartnershipApi } from '~/api/realm/partnership'
import { MasterNodeApi } from '~/api/master/node'
import { RealmNodeApi } from '~/api/realm/node'
import { CirculessMarketplaceApi } from '~/api/circuless/marketplace'

class Api {
  auth = {
    master: MasterAuthApi,
    realm: RealmAuthApi
  }
  user = {
    master: MasterUserApi,
    realm: RealmUserApi,
  }
  organisation = {
    master: MasterOrganisationApi,
    realm: RealmOrganisationApi,
  }
  partnership = {
    realm: RealmPartnershipApi,
  }
  node = {
    master: MasterNodeApi,
    realm: RealmNodeApi
  }
  marketplace = {
    circuless: CirculessMarketplaceApi,
  }
}

export const api = new Api()
