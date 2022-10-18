const path = require('path')
const rootDir = path.join(__dirname, `..`)

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir,
  preset: undefined,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/configs/jest.setup.ts'],
  transform: {
    '^.+\\.js$': "babel-jest"
  },
  testMatch: [
    '<rootDir>/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/**/__tests__/*.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    "<rootDir>/src/index.js"
  ],
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "es6",
    'ts',
    'tsx'
  ],
  globals: {
    __DEV__: true
  },
  testEnvironment: "jsdom",
  transform: {
    '\\.[jt]sx?$': ['esbuild-jest', { sourcemap: true }],
  },
}
