import { defineNuxtPlugin, navigateTo } from "nuxt/app";
import type { miscTypes } from "~/shared/types";

class Oidc {
    async login(realm: miscTypes.RealmTypes, redirectUri?: string) {
        switch (realm) {
            case "master":
                await navigateTo(
                    `/api/master/auth/login${
                        redirectUri ? `?redirectUri=${redirectUri}` : ""
                    }`,
                    {
                        external: true,
                    }
                );
                break;
                
            default:
                await navigateTo(
                    `/api/realm/${realm}/auth/login${
                        redirectUri ? `?redirectUri=${redirectUri}` : ""
                    }`,
                    {
                        external: true,
                    }
                );
                break;
        }
    }

    async logout(realm: miscTypes.RealmTypes, redirectUri?: string) {
        switch (realm) {
            case "master":
                await navigateTo(
                    `/api/master/auth/logout${
                        redirectUri ? `?redirectUri=${redirectUri}` : ""
                    }`,
                    {
                        external: true,
                    }
                );
                break;

            default:
                await navigateTo(
                    `/api/realm/${realm}/auth/logout${
                        redirectUri ? `?redirectUri=${redirectUri}` : ""
                    }`,
                    {
                        external: true,
                    }
                );
                break;
        }
    }
}

export default defineNuxtPlugin(() => {
    const oidc = new Oidc();
    return { provide: { oidc } };
});
