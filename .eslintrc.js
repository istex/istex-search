const path = require('path');

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'standard-with-typescript',
    'standard-jsx',
    'standard-react',
    'next/core-web-vitals',
  ],
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  rules: {
    // Note: the default 'semi' rule is disabled because '@typescript-eslint/semi' extends it and having
    // both enabled at the same time reports incorrect errors.
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: { delimiter: 'semi', requireLast: true },
        singleline: { delimiter: 'semi', requireLast: true },
      },
    ],
    'no-extra-semi': 'error',

    // Both rules need to be specified because typescript projects can contain both JS and TS files
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
  },
};
