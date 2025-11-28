import { Realm } from "@prisma/client";
import { miscTypes } from "~/shared/types";

defineRouteMeta({
    openAPI: {
        tags: ["Circuless Discovery"],
        description: "Get Thing Descriptions in Discovery section",
        requestBody: {
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                    },
                },
            },
            required: true,
        },
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
            const query = await $fetch<string>(`${node.host}/api/v1/things`, {
        method: "GET",
    });
          return query
        },
        {
            protected: true,

            schemas: {
                params: miscTypes.ClientRealmsParamSchema.concat(miscTypes.IdParamSchema),

            },
        }
    )
});
