import { Realm } from "@prisma/client"
import { readBody } from "h3"
import {
  AllRealmsParamSchema,
  IdParamSchema,
  TDIdParamSchema
} from "~/shared/types/misc"

import type { PostThingDescription, FetchThingDescription } from "~/api/realm/td"

defineRouteMeta({
  openAPI: {
    tags: ["Circuless Discovery"],
    description: "Create a Thing Description for a specific item",
  },
})

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => {
      console.log('CALLBACK HE LLEGADO HASTA QUI')
      const newTD = await readBody<PostThingDescription>(event)
      const node = await db.node.queries.getUserRealm(
        params!.id,
        user!.id,
        params!.realm as Realm,
        db.node.args.all
      )

      const createdTD = await $fetch<FetchThingDescription>(
        `${node.host}/api/v1/things`,
        {
          method: "POST",
          body: newTD,
        }
      )
      console.log(createdTD)
      return createdTD
    },
    {
      protected: true,
      schemas: {
        params: AllRealmsParamSchema
          .concat(IdParamSchema)
      },
    }
  )
})
