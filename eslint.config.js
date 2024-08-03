module.exports = {
  parser '@typescript-eslintparser',
  parserOptions {
    ecmaVersion 2020,
    sourceType 'module',
  },
  extends [
    'eslintrecommended',
    'plugin@typescript-eslintrecommended',
    'pluginprettierrecommended'
  ],
  rules {
    'prettierprettier' 'error',
  },
};