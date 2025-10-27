import { authTypes } from "~/shared/types";

export default defineEventHandler(async (event) => {
    return await apiWrapper(
        event,
        async ({ query }) => {
            const redirectUri = query?.redirectUri as string | undefined;
            const authRedirectUrl = await keycloak.getRedirectUrl(
                event,
                "master",
                false,
                redirectUri
            );
            return await sendRedirect(event, authRedirectUrl.toString());
        },
        {
            schemas: {
                query: authTypes.AuthQuerySchema,
            },
            protected: false,
        }
    );
});
