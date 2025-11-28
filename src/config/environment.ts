interface EnvironmentProps {
    DB: {
        URL: string;
        USER: string;
        PASSWORD: string;
        NAME: string;
        HOST: string;
        PORT: string;
    };
    OIDC_ENDPOINT: string;
    REALM_SECRETS: {
        master: string;
        circuless: string;
    };
}

enum RealmNames {
    master = "master",
    circuless = "circuless",
}

export interface RealmProps {
    client_id: string;
    realm: RealmNames;
}

export type RealmsConfig = Record<RealmNames, RealmProps>;

interface PKI {
    URL: string;
    USER: string;
    PASSWORD: string;
}

interface EnvironmentVariables {
    ENV: EnvironmentProps;
    PKI: PKI;
    APP_URL: string;
    REALMS: RealmsConfig;
}

const secrets = JSON.parse(
    process.env.NUXT_OIDC_REALM_SECRETS ?? "{}"
) as Record<string, string>;

const realms = JSON.parse(
    process.env.NUXT_PUBLIC_OIDC_REALMS ?? "{}"
) as RealmsConfig;

export const environment: EnvironmentVariables = {
    ENV: {
        DB: {
            URL: process.env.DATABASE_URL ?? "",
            USER: process.env.DATABASE_USER ?? "",
            PASSWORD: process.env.DATABASE_PASSWORD ?? "",
            NAME: process.env.DATABASE_NAME ?? "",
            HOST: process.env.DATABASE_HOST ?? "",
            PORT: process.env.PORT ?? "",
        },
        OIDC_ENDPOINT: process.env.NUXT_PUBLIC_OIDC_ENDPOINT ?? "",
        REALM_SECRETS: {
            master: secrets["master"],
            circuless: secrets["circuless"],
        },
    },
    REALMS: realms,
    PKI: {
        URL: process.env.NUXT_PKI_URL ?? "",
        USER: process.env.NUXT_PKI_USER ?? "",
        PASSWORD: process.env.NUXT_PKI_PASSWORD ?? "",
    },
    APP_URL: process.env.NUXT_PUBLIC_APP_URL ?? "",
};
