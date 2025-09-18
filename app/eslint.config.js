// @ts-check

import { defineConfig } from 'eslint/config'
// desativa regras que conflitam com o Prettier
import prettierConfig from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
// Plugins
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default defineConfig([
  ...tseslint.configs.recommended,

  {
    ignores: ['node_modules/**', 'dist/**', '.vercel/**', '.turbo/**', 'server/views/**'],
  },

  {
    //Agrupa imports
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: {
            memberTypes: ['field'], // Aplica a regra somente a propriedades (fields)
            order: 'alphabetically', // Ordena alfabeticamente (ascendente)
          },
        },
      ],
      'padding-line-between-statements': [
        'error',
        {
          //força linha em branco antes de blocos, funções, ifs, returns e declarações multilinha
          blankLine: 'always',
          next: ['multiline-const', 'multiline-expression', 'block', 'function', 'if', 'block-like', 'return'],
          prev: '*',
        },
      ],
      // obriga uso de aspas simples, mas permite aspas duplas para evitar escapes
      quotes: ['error', 'single', { avoidEscape: true }],
      //#sempontoevirgula
      semi: ['error', 'never'],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      //ordena chaves em ordem ascendente
      'sort-keys': ['error', 'asc', { caseSensitive: true, minKeys: 2, natural: true }],
    },
  },

  prettierConfig,
])
