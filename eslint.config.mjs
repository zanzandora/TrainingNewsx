// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Basic rules
    'no-console': 'off', // Allow console statements in server code
    'prefer-const': ['error'],

    // Vue specific rules
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off', // Allow single-word component names
  },
})
