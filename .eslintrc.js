module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier'],
  parser: '@babel/eslint-parser',
  plugins: ['html'],
  overrides: [
    {
      files: ['*.js'],
      parserOptions: {
        requireConfigFile: false,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-props-no-spreading': 0,
  },
};
