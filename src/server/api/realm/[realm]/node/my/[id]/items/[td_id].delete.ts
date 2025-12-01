import { Realm } from "@prisma/client";
import { AllRealmsParamSchema, IdParamSchema, TDIdParamSchema } from "~/shared/types/misc";

defineRouteMeta({
    openAPI: {
        tags: ["Circuless Discovery"],
        description: "Delete Thing Description in Discovery section of specific item",

    },
});
export default defineEventHandler(async (event) => {
return await apiWrapper(
        event,
        async ({ user, params }) => {
            const node = await db.node.queries.getUserRealm(
                params!.id,
                user!.id,
                params!.realm as Realm,
                db.node.args.all
            )
            return await $fetch<string>(`${node.host}/api/v1/things/${params!.td_id}`, {
        method: "DELETE",
    });
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
});
