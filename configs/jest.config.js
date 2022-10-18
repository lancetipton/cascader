const path = require('path')
const rootDir = path.join(__dirname, `..`)

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/configs/jest.setup.ts'],
  transform: { '\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }], },
  collectCoverageFrom: ['**/*.ts', '!**/*.types.ts', '!**/*.d.ts', '!**/index.ts'],
  testMatch: [
    '<rootDir>/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/**/__tests__/*.{js,jsx,ts,tsx}',
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "es6",
    'ts',
    'tsx'
  ],
}
