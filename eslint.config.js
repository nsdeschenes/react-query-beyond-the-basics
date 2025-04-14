import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  pluginQuery.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['./src/routeTree.gen.ts'],
    rules: {
      'unicorn/no-abusive-eslint-disable': 'off',
    },
  },
)
