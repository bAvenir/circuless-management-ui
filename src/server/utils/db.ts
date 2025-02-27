import { UserArgs } from '../db/user/args'
import { UserQueries } from '../db/user/queries'
import { OrganisationArgs } from '../db/organisation/args'
import { OrganisationQueries } from '../db/organisation/queries'

class DB {
  user = {
    queries: UserQueries,
    args: UserArgs,
  }
  organisation = {
    queries: OrganisationQueries,
    args: OrganisationArgs,
  }
}

export const db = new DB()
