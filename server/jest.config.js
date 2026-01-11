/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Это заставит Jest искать тесты в папке tests
  testMatch: ["**/tests/**/*.test.ts"],
};