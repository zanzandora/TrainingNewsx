// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  debug: true,
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@vueuse/nuxt',
  ],
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
  // !không nên dùng trực tiếp process.env trong nuxt.config.ts/js
  // !Nếu lỡ dùng trong config, hoặc trong code có thể chạy client-side, thì biến env đó sẽ không tồn tại trên browser → gây bug runtime.
  runtimeConfig: {
    internalApiUrl: 'http://news-be-api.railway.internal',
    public: {
      baseUrlApi: 'https://news-be-api-production.up.railway.app', // sẽ inject từ ENV
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
