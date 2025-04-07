import { MasterAuthApi } from '~/api/master/auth'
import { RealmAuthApi } from '~/api/realm/auth'
import { RealmUserApi } from '~/api/realm/user'
import { MasterOrganisationApi } from '~/api/master/organisation'
import { MasterUserApi } from '~/api/master/user'
import { RealmOrganisationApi } from '~/api/realm/organisation'
import { RealmPartnershipApi } from '~/api/realm/partnership'
import { MasterNodeApi } from '~/api/master/node'
import { RealmNodeApi } from '~/api/realm/node'

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
}

export const api = new Api()
