import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // eslint-disable-next-line no-undef
  baseDirectory: import.meta.dirname ?? process.cwd(),
})

export default [
  { ignores: ['dist', 'functions'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:prettier/recommended'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },

    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooksの推奨ルール

      'react/react-in-jsx-scope': 'off', // React18 以降は JSX に React import 不要のため無効化

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error',
    },

    settings: {
      react: {
        version: 'detect', // Reactのバージョンを自動検出
      },
    },
  },
]
