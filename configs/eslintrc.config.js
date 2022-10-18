module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: require('path').join(__dirname, '../'),
  },
  ignorePatterns: [
    'build/',
  ],
  globals: {
    jest: true,
    __DEV__: true,
    expect: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {},
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true,
  },
  plugins: ['jest'],
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  settings: {},
  rules: {
    /* General */
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '_',
      },
    ],
    '@typescript-eslint/no-var-requires': 0,
    'no-console': [ 'warn', { allow: [ 'warn', 'error' ] }],
    'brace-style': [ 'error', 'stroustrup' ],
    indent: [ 'error', 2, { offsetTernaryExpressions: true }],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'id-length': [
      'error',
      {
        min: 2,
        exceptions: [ 'y', 'x', 'i', 'e', '_', 'k', 'p', 'P', 'I' ],
      },
    ],
    'one-var': [ 'error', 'never' ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'newline-per-chained-call': 2,
    'array-bracket-spacing': [
      'error',
      'always',
      {
        arraysInArrays: false,
        singleValue: false,
        objectsInArrays: false,
      },
    ],
    'space-in-parens': [ 'error', 'never' ],
    'object-curly-spacing': [ 'error', 'always' ],
    'func-call-spacing': [ 'error', 'never' ],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        args: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '_|__|checkDocString|checkDataTable|checkBackground',
      },
    ],
    /* Jest */
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/no-conditional-expect': 'off',
    'jest/valid-expect': 'error',
    'jest/no-mocks-import': 0,
    'jest/no-export': 0,
    'jest/valid-title': 0,
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.spec.js', '**/*.test.ts', '**/*.spec.ts', 'tasks/**'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
