module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'standard/computed-property-even-spacing': 'off',
    'no-debugger': 'error',
    'no-var': 'error',
    'default-case': 'error',
    'array-callback-return': 'error',
    'prefer-template': 'error',
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        ignorePattern: '.*data:image/.*',
        ignoreRegExpLiterals: true,
      },
    ],
    'prettier/prettier': [
      'error',
      {
        htmlWhitespaceSensitivity: 'ignore',
        singleQuote: true,
        trailingComma: 'es5',
        semi: false,
        arrowParens: 'always',
      },
    ],
    '@typescript-eslint/explicit-function-return-type':'off', // 允许隐式返回值
    '@typescript-eslint/consistent-type-assertions': 'off', // 允许断言
    '@typescript-eslint/no-non-null-assertion': 'off', // 允许非空断言
    '@typescript-eslint/ban-ts-ignore': 'off', // 允许 ts-ignore
    '@typescript-eslint/no-explicit-any': 'off', // 允许 any
  },
}
