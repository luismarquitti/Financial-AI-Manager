import { jest } from '@jest/globals';

// packages/server/__mocks__/pg.ts
export class Pool {
  // Mock the query method
  query = jest.fn();

  // Mock other methods used by the application if any
  on = jest.fn();
  connect = jest.fn(() => Promise.resolve({
    query: this.query,
    release: jest.fn(),
  }));
  end = jest.fn();
}