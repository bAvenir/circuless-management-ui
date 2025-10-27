import { Realm } from "@prisma/client";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const nuxtApp = useNuxtApp();
    const $oidc = nuxtApp.$oidc;
    const access = await api.auth.master.checkAccess();

    if (!access) {
        if (import.meta.client) await $oidc.login(Realm.master);
        return abortNavigation(`No access to master realm`);
    }
});
