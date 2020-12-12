module.exports = {
  out: './docs/',

  readme: 'none',
  includes: './lib',
  exclude: [
      '**/__tests__/**/*',
      '**/__test_utils__/**/*',
      '**/__fixtures__/**/*',
      '**/testsuite/**/*',
      '**/node_modules/**/*',
      '**/typings/**/*'
  ],

  mode: 'file',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true
};