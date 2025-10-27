import { UserArgs } from "../db/user/args";
import { UserQueries } from "../db/user/queries";
import { OrganisationArgs } from "../db/organisation/args";
import { OrganisationQueries } from "../db/organisation/queries";
import { PartnershipQueries } from "../db/partnership/queries";
import { PartnershipArgs } from "../db/partnership/args";
import { NodeArgs } from "../db/node/args";
import { NodeQueries } from "../db/node/queries";

class DB {
    user = {
        queries: UserQueries,
        args: UserArgs,
    };
    organisation = {
        queries: OrganisationQueries,
        args: OrganisationArgs,
    };
    partnership = {
        queries: PartnershipQueries,
        args: PartnershipArgs,
    };
    node = {
        queries: NodeQueries,
        args: NodeArgs,
    };
}

export const db = new DB();
