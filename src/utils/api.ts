import { RealmAuthApi } from '~/api/realm/auth'
import { RealmUserApi } from '~/api/realm/user'
import { MasterOrganisationApi } from '~/api/master/organisation'
import { MasterUserApi } from '~/api/master/user'
import { RealmOrganisationApi } from '~/api/realm/organisation'
import { CirculessUserApi } from '~/api/circuless/user'
import { MasterNodeApi } from '~/api/master/node'
import { RealmNodeApi } from '~/api/realm/node'

class Api {
  auth = {
    realm: RealmAuthApi
  }
  user = {
    master: MasterUserApi,
    realm: RealmUserApi,
    circuless: CirculessUserApi,
  }
  organisation = {
    master: MasterOrganisationApi,
    realm: RealmOrganisationApi,
  }
  node = {
    master: MasterNodeApi,
    realm: RealmNodeApi
  }
}

export const api = new Api()
