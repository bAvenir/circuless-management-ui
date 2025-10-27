import { authTypes } from "~/shared/types";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    console.log("LOGIN CALLBACK HIT");
    return await apiWrapper(
        event,
        async ({ query }) => {
            await keycloak.login(
                event,
                query!.code as string,
                query!.state as string,
                "master"
            );
            sendRedirect(event, `${config.public.APP_URL}/master`);
        },
        {
            schemas: {
                query: authTypes.KeycloakAuthCodeQuerySchema,
            },
        }
    );
});
