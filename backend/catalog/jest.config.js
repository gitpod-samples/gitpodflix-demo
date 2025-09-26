module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 5000,
  forceExit: true,
  verbose: true,
  bail: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/index.ts' // Exclude main server file from coverage as it's hard to test
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
