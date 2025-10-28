import { authTypes, miscTypes } from "~/shared/types";

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ params, query }) => {
            const realm = params!.realm as miscTypes.RealmTypes;
            const redirectUri = query?.redirectUri as string | undefined;
            const authRedirectUrl = await keycloak.getRedirectUrl(
                event,
                realm,
                false,
                redirectUri
            );
            await sendRedirect(event, authRedirectUrl.toString());
        },
        {
            schemas: {
                params: miscTypes.ClientRealmsParamSchema,
                query: authTypes.AuthQuerySchema,
            },
            protected: false,
        }
    );
});
