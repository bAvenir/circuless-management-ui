import type { Realm } from '@prisma/client'

interface Realms {
  [key: string]: {
    client_id: string
    realm: Realm
  }
}

interface RealmSecrets {
  [key: string]: string
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src/',
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    prerender: {
      ignore: ['/master', '/circuless'],
    },
  },
  experimental: {
    appManifest: false,
    asyncContext: true,
  },
  modules: ['@prisma/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@primevue/nuxt-module', 'nuxt-viewport'],
  css: ['~/assets/css/main.css', '~/assets/css/overrides.css', 'primeicons/primeicons.css', '@fortawesome/fontawesome-svg-core/styles.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  primevue: {
    importTheme: { from: '@/themes/mytheme.js' },
  },
  vite: {
    // Prisma Client JS is not compatible with the browser, so we need to alias it.
    // Issue: https://github.com/prisma/prisma/issues/12504
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },
  runtimeConfig: {
    OIDC: {
      REALM_SECRETS: JSON.parse(process.env.NUXT_OIDC_REALM_SECRETS ?? '{}') as RealmSecrets,
    },
    public: {
      APP_URL: process.env.NUXT_PUBLIC_APP_URL ?? '',
      OIDC: {
        ENDPOINT: process.env.NUXT_PUBLIC_OIDC_ENDPOINT ?? '',
        REALMS: JSON.parse(process.env.NUXT_PUBLIC_OIDC_REALMS ?? '{}') as Realms,
      },
    },
  },
})
