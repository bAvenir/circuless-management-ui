import { Realm } from "@prisma/client"
import { readBody } from "h3"
import {
  AllRealmsParamSchema,
  IdParamSchema,
  TDIdParamSchema
} from "~/shared/types/misc"
import type { ThingDescription } from "~/api/realm/td"

defineRouteMeta({
  openAPI: {
    tags: ["Circuless Discovery"],
    description: "Update Thing Description in Discovery section of specific item",
  },
})

export default defineEventHandler(async (event) => {
  return await apiWrapper(
    event,
    async ({ user, params }) => {

      const updateBody = await readBody<ThingDescription>(event)

      const node = await db.node.queries.getUserRealm(
        params!.id,
        user!.id,
        params!.realm as Realm,
        db.node.args.all
      )

      return await $fetch<ThingDescription>(
        `${node.host}/api/v1/things/${params!.td_id}`,
        {
          method: "PATCH",
          body: updateBody,
        }
      )
    },
    {
      protected: true,
      schemas: {
        params: AllRealmsParamSchema
          .concat(IdParamSchema)
          .concat(TDIdParamSchema),
      },
    }
  )
})
