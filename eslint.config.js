// @ts-check
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const cypress = require('eslint-plugin-cypress');
const globals = require('globals');

const CJS_CONFIG_FILES = [
  '*.config.js',
  'babel.config.js',
  'sidebars.js',
  'eslint.config.js',
];

module.exports = tseslint.config(
  {
    // Build output and generated/vendored content are never linted.
    ignores: [
      '.docusaurus/**',
      'build/**',
      'node_modules/**',
      'versioned_docs/**',
      'versioned_sidebars/**',
      'static/**',
      'preview/**',
      'cypress/screenshots/**',
      '.netlify/**',
      '.lighthouseci/**',
    ],
  },
  js.configs.recommended,
  {
    // TypeScript-aware rules only apply to actual TypeScript files.
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    rules: {
      // Existing code has legacy `any` usage; keep it visible without
      // failing CI until it's cleaned up incrementally.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    // React components: browser code across JS, JSX, TS and TSX.
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      ...react.configs.flat.recommended.plugins,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...Object.fromEntries(
        Object.entries(reactHooks.configs['recommended-latest'].rules).map(
          ([rule, severity]) => [
            rule,
            // Keep the classic, high-confidence hook-order check as an
            // error; the newer React Compiler-readiness checks are
            // useful signal but shouldn't block CI on existing code yet.
            rule === 'react-hooks/rules-of-hooks' ? severity : 'warn',
          ]
        )
      ),
      'no-unused-vars': 'warn',
      // Prop types are covered by TypeScript in this codebase.
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Cypress end-to-end tests and support files.
    files: ['cypress/**/*.js', 'cypress.config.js'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      globals: {
        ...globals.node,
        ...cypress.configs.recommended.languageOptions.globals,
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // Node-run CommonJS config/build scripts.
    files: CJS_CONFIG_FILES,
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Other plain Node scripts (e.g. Prism theme definitions).
    files: ['src/prism/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // Deno-based Netlify edge functions.
    files: ['netlify/edge-functions/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        Deno: 'readonly',
      },
    },
  }
);
