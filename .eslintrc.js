/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'standard',
    'standard-jsx',
    'standard-react',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: ['error', 'always'],
    'no-extra-semi': 'error',
    'comma-dangle': ['error', 'always-multiline'],
  },
};
