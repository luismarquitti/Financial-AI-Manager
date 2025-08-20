import { Pool } from 'pg';
import * as dbService from './dbService';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

// Tell Jest to use the mock from the __mocks__ directory
jest.mock('pg');

const mockPool = new Pool() as jest.Mocked<Pool>;

describe('dbService', () => {
  beforeEach(() => {
    // Clear all previous mock data before each test
    (mockPool.query as jest.Mock).mockClear();
  });

  describe('getAccounts', () => {
    it('should retrieve all accounts from the database', async () => {
      const mockAccounts = [
        { id: '1', name: 'Checking Account' },
        { id: '2', name: 'Savings Account' },
      ];
      
      // Set the mock implementation for this specific test
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockAccounts });

      const accounts = await dbService.getAccounts();

      // Expect the service to have called the db query function
      expect(mockPool.query).toHaveBeenCalledWith('SELECT id, name FROM accounts ORDER BY name');
      
      // Expect the service to return the mocked data
      expect(accounts).toEqual(mockAccounts);
      expect(accounts.length).toBe(2);
    });
  });

  describe('getCategories', () => {
    it('should retrieve all categories from the database', async () => {
        const mockCategories = [
            { id: '1', name: 'Groceries' },
            { id: '2', name: 'Utilities' },
        ];
        
        (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockCategories });

        const categories = await dbService.getCategories();

        expect(mockPool.query).toHaveBeenCalledWith('SELECT id, name FROM categories ORDER BY name');
        expect(categories).toEqual(mockCategories);
    });
  });
});