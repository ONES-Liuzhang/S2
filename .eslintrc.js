require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'airbnb-base/legacy',
    'prettier',
    'plugin:jest/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
    'vue/setup-compiler-macros': true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', 'import', 'vue'],
  settings: {
    jest: {
      version: 26,
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'prettier/prettier': [
      1,
      {
        endOfLine: 'lf',
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        printWidth: 80,
        proseWrap: 'never',
        overrides: [{ files: '.prettierrc', options: { parser: 'json' } }],
      },
    ],
    'import/order': 2,
    'import/no-default-export': 0,
    'no-restricted-syntax': 0,
    semi: 0,
    'no-console': 2,
    'consistent-return': 0,
    'import/no-extraneous-dependencies': 2,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': [
      2,
      {
        allowAfterThis: true,
      },
    ],
    'no-plusplus': [
      1,
      {
        allowForLoopAfterthoughts: true,
      },
    ],
    'class-methods-use-this': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'import/no-named-default': 0,
    'react-hooks/exhaustive-deps': 0,
    'react-hooks/rules-of-hooks': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    ],
    'react/display-name': 0,
    'react/prop-types': 0,
    'react/state-in-constructor': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-use-before-define': 0,
    '@typescript-eslint/no-use-before-define': [2],
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': [1],
    'no-alert': 2,
    'no-caller': 2,
    'no-else-return': 2,
    'no-useless-return': 2,
    'no-extra-bind': 2,
    'no-magic-numbers': 0,
    'no-self-compare': 2,
    'no-multi-spaces': 2,
    'require-await': 2,
    'no-multi-assign': 2,
    'no-var': 2,
    'no-useless-rename': 2,
    'object-shorthand': 2,
    'prefer-arrow-callback': 2,
    'prefer-const': 2,
    'max-statements-per-line': [2, { max: 1 }],
    'max-params': [1, 4],
    'no-unreachable': 2,
    eqeqeq: [
      2,
      'always',
      {
        null: 'ignore',
      },
    ],
    curly: [2, 'multi-line', 'consistent'],
    'guard-for-in': 0,
    'vue/multi-word-component-names': 0,
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
    },
    {
      files: ['*.tsx'],
      rules: {
        'react-hooks/exhaustive-deps': 1,
        'react-hooks/rules-of-hooks': 2,
      },
    },
  ],
};