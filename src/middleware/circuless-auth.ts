import { Realm } from "@prisma/client";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const nuxtApp = useNuxtApp();
    const $oidc = nuxtApp.$oidc;

    const access = await api.auth.realm.checkAccess(Realm.circuless);

    if (!access) {
        if (import.meta.client) await $oidc.login(Realm.circuless);
        return abortNavigation(`No access to ${Realm.circuless} realm`);
    }
});
