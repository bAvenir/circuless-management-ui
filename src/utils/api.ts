import { AuthApi } from '~/api/auth'
import { RealmUserApi } from '~/api/realm/user'
import { MasterOrganisationApi } from '~/api/master/organisation'
import { MasterUserApi } from '~/api/master/user'
import { UserApi } from '~/api/user'
import { RealmOrganisationApi } from '~/api/realm/organisation'

class Api {
  auth = AuthApi
  user = {
    ...UserApi,
    master: MasterUserApi,
    realm: RealmUserApi,
  }
  organisation = {
    master: MasterOrganisationApi,
    realm: RealmOrganisationApi,
  }
}

export const api = new Api()
