/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'client',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
