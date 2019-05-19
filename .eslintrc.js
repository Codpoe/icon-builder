module.exports = {
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {}
};
