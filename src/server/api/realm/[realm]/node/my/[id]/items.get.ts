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
            return await fetch(`${node.host}/api/v1/things`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
        },
        {
            protected: true,
            schemas: {
                params: miscTypes.IdParamSchema,
            },
        }
    )
});
