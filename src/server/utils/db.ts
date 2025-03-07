import { UserArgs } from '../db/user/args'
import { UserQueries } from '../db/user/queries'
import { OrganisationArgs } from '../db/organisation/args'
import { OrganisationQueries } from '../db/organisation/queries'
import { NodeArgs } from '../db/node/args'
import { NodeQueries } from '../db/node/queries'

class DB {
  user = {
    queries: UserQueries,
    args: UserArgs,
  }
  organisation = {
    queries: OrganisationQueries,
    args: OrganisationArgs,
  }
  node = {
    queries: NodeQueries,
    args: NodeArgs,
  }
}

export const db = new DB()
