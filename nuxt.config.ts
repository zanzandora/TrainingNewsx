// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/ui', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],

  // *ESLint config
  eslint: {
    config: {
      standalone: false, // Required when using with external ESLint configs
    },
  },

  // *Vite config
  vite: {
    plugins: [tailwindcss()],
  },

  // *PostCSS config
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // *Runtime config
  runtimeConfig: {
    mongodbUri: `${process.env.MONGODB_URI}/News`,
  },

  // *Fonts config
  fonts: {
    families: [
      // Google Fonts
      { name: 'Montserrat', provider: 'google' },
    ],
    defaults: {
      weights: [400, 600, 700], // Tải các weight mặc định
      subsets: ['latin'], // Subset mặc định
    },
  },
})
