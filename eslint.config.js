import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintReact from '@eslint-react/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  pluginQuery.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  eslintReact.configs['recommended-type-checked'],
  reactHooks.configs['recommended-latest'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
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
