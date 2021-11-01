module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  globals: {
    _gaq: false,
    process: false,
    ActiveXObject: false,
    VERSION: false,
    // Build globals
    __dirname: false,
    // Test globals
    after: false,
    afterEach: false,
    assert: false,
    before: false,
    beforeEach: false,
    describe: false,
    expect: false,
    it: false,
    sinon: false,
    xit: false,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      spread: true,
      jsx: true,
    },
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    // 'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    'no-var': 'error',
    'no-console': 2,
  },
};
