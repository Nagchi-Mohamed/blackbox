module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/coverage/'
  ],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/tests/**/*.test.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  verbose: true
}; 