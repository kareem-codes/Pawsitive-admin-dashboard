// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'ar', file: 'ar.json', name: 'العربية', dir: 'rtl' }
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://pawsitive-api.kareem-codes.com/api/v1'
    }
  },

  // Development proxy to avoid CORS issues
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  routeRules: {
    // Proxy API requests in development to avoid CORS (excluding icon API)
    '/api/v1/**': {
      proxy: process.env.NUXT_PUBLIC_API_BASE ? `${process.env.NUXT_PUBLIC_API_BASE}/**` : 'https://pawsitive-api.kareem-codes.com/api/v1/**'
    }
  },

  app: {
    head: {
      title: 'Pawsitive Systems - Vet Clinic Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Comprehensive veterinary clinic management system' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  tailwindcss: {
    exposeConfig: false,
    viewer: true
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  // Production optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true
  },

  experimental: {
    payloadExtraction: false
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'pinia': ['pinia'],
            'axios': ['axios']
          }
        }
      }
    }
  }
})
