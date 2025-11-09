// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@auth0/auth0-nuxt',
  ],

  devtools: {
    enabled: true
  },

  runtimeConfig: {
    auth0: {
      domain: process.env.NUXT_AUTH0_DOMAIN,
      clientId: process.env.NUXT_AUTH0_CLIENT_ID,
      clientSecret: process.env.NUXT_AUTH0_CLIENT_SECRET,
      sessionSecret: process.env.NUXT_AUTH0_SESSION_SECRET,
      appBaseUrl: process.env.NUXT_AUTH0_APP_BASE_URL,
    },
    azureEndpoint: process.env.AZURE_ENDPOINT,
    azureApiKey: process.env.AZURE_API_KEY,
    azureDeployment: process.env.AZURE_DEPLOYMENT,

    nvidiaApiKey: process.env.NVIDIA_API_KEY,

    nessieApiKey: process.env.NESSIE_API_KEY,

    azureStorageAccountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    azureStorageAccountKey: process.env.AZURE_STORAGE_ACCOUNT_KEY,
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
