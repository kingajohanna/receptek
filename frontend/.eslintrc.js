module.exports = {
  extends: ['plugin:@typescript-eslint/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    'no-return-await': 0,
    'arrow-parens': 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'no-useless-constructor': 0,
    'no-param-reassign': ['error', { props: false}],
    'class-methods-use-this': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['src/e2e/**.*', '**/*.test.*', '**/*.spec.*'] }],
    'function-paren-newline': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-useless-constructor': 2,
    'import/extensions': [
      2,
      {
        ts: 'never',
        js: 'never',
        json: 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
