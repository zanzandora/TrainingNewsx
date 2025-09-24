// @ts-check
import antfu from '@antfu/eslint-config'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      type: 'app',
      vue: true,
      typescript: true,
      ignores: ['.pnpm-store/**'],
      stylistic: false,
    },
    {
      rules: {
        // Tắt hết rules format để nhường Prettier
        'prettier/prettier': 'off',
        'antfu/format': 'off',

        // Giữ lại rules chất lượng code
        'vue/singleline-html-element-content-newline': 'off',
        'ts/no-redeclare': 'off',
        'ts/consistent-type-definitions': ['error', 'type'],
        'no-console': ['warn'],
        'antfu/no-top-level-await': ['off'],
        'node/prefer-global/process': ['off'],
        'node/no-process-env': ['error'],
        'perfectionist/sort-imports': [
          'error',
          {
            tsconfigRootDir: '.',
          },
        ],
        'unicorn/filename-case': [
          'error',
          {
            case: 'kebabCase',
            ignore: ['README.md'],
          },
        ],
      },
    },
  ),
)
