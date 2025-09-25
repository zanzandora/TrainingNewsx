// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
  ],
  css: ['~/assets/css/main.css'],

  // *Eslint config
  eslint: {
    config: {
      standalone: false,
    },
  },

  // *PostCSS config
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
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