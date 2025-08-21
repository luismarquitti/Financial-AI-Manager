/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'server',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testMatch: ['**/test/**/*.test.ts', '**/src/**/*.test.ts'],
};
