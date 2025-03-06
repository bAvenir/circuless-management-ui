import { RealmAuthApi } from '~/api/realm/auth'
import { RealmUserApi } from '~/api/realm/user'
import { MasterOrganisationApi } from '~/api/master/organisation'
import { MasterUserApi } from '~/api/master/user'
import { RealmOrganisationApi } from '~/api/realm/organisation'
import { CirculessUserApi } from '~/api/circuless/user'

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
}

export const api = new Api()
