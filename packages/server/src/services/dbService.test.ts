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

  describe('getTransactions', () => {
    it('should retrieve all transactions with account and category info', async () => {
      const mockTransactions = [
        { id: '1', date: new Date(), description: 'Test', amount: 100, category_id: '1', category_name: 'Cat1', account_id: '1', account_name: 'Acc1' },
      ];
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: mockTransactions });

      const transactions = await dbService.getTransactions();

      expect(mockPool.query).toHaveBeenCalled();
      expect(transactions).toHaveLength(1);
      expect(transactions[0].description).toBe('Test');
    });
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

  describe('createTransaction', () => {
    it('should create a new transaction and return it', async () => {
      const newTx = { date: new Date(), description: 'New Stuff', amount: 50, categoryId: '1', accountId: '1' };
      const returnedId = { id: '2' };
      const fullTx = { id: '2', date: newTx.date, description: newTx.description, amount: newTx.amount, category_id: '1', category_name: 'Cat1', account_id: '1', account_name: 'Acc1' };

      (mockPool.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [returnedId] })
        .mockResolvedValueOnce({ rows: [fullTx] });

      const result = await dbService.createTransaction(newTx);

      expect(mockPool.query).toHaveBeenCalledTimes(2);
      expect(result.id).toBe('2');
      expect(result.description).toBe(newTx.description);
    });
  });

  describe('updateTransaction', () => {
    it('should update an existing transaction', async () => {
        const updatedTxData = { id: '1', date: new Date(), description: 'Updated Description', amount: 150.75, categoryId: '2', accountId: '2' };
        const returnedUpdatedTx = {
            id: '1',
            date: updatedTxData.date,
            description: updatedTxData.description,
            amount: updatedTxData.amount,
            category_id: '2',
            category_name: 'Category 2',
            account_id: '2',
            account_name: 'Account 2',
        };

        (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [returnedUpdatedTx] });

        const result = await dbService.updateTransaction(updatedTxData);

        expect(mockPool.query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE transactions'),
            [updatedTxData.id, updatedTxData.date, updatedTxData.description, updatedTxData.amount, updatedTxData.categoryId, updatedTxData.accountId]
        );
        expect(result.description).toBe('Updated Description');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });
      const result = await dbService.deleteTransaction('1');
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM transactions WHERE id = $1', ['1']);
      expect(result).toBe(true);
    });
  });

  describe('createAccount', () => {
    it('should create an account', async () => {
      const newAccount = { id: '3', name: 'New Account' };
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [newAccount] });
      const result = await dbService.createAccount('New Account');
      expect(mockPool.query).toHaveBeenCalledWith('INSERT INTO accounts (name) VALUES ($1) RETURNING id, name', ['New Account']);
      expect(result).toEqual(newAccount);
    });
  });

  describe('updateAccount', () => {
    it('should update an account', async () => {
      const updatedAccount = { id: '1', name: 'Updated Account' };
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedAccount] });
      const result = await dbService.updateAccount('1', 'Updated Account');
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE accounts SET name = $2 WHERE id = $1 RETURNING id, name', ['1', 'Updated Account']);
      expect(result).toEqual(updatedAccount);
    });
  });

  describe('deleteAccount', () => {
    it('should delete an account and nullify its transactions', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rowCount: 1 }); // for all queries in transaction
      const result = await dbService.deleteAccount('1');
      expect(mockPool.query).toHaveBeenCalledWith('BEGIN');
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE transactions SET account_id = NULL WHERE account_id = $1', ['1']);
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM accounts WHERE id = $1', ['1']);
      expect(mockPool.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toBe(true);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const newCategory = { id: '3', name: 'New Category' };
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [newCategory] });
      const result = await dbService.createCategory('New Category');
      expect(mockPool.query).toHaveBeenCalledWith('INSERT INTO categories (name) VALUES ($1) RETURNING id, name', ['New Category']);
      expect(result).toEqual(newCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updatedCategory = { id: '1', name: 'Updated Category' };
      (mockPool.query as jest.Mock).mockResolvedValueOnce({ rows: [updatedCategory] });
      const result = await dbService.updateCategory('1', 'Updated Category');
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE categories SET name = $2 WHERE id = $1 RETURNING id, name', ['1', 'Updated Category']);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category and nullify its transactions', async () => {
      (mockPool.query as jest.Mock).mockResolvedValue({ rowCount: 1 }); // for all queries in transaction
      const result = await dbService.deleteCategory('1');
      expect(mockPool.query).toHaveBeenCalledWith('BEGIN');
      expect(mockPool.query).toHaveBeenCalledWith('UPDATE transactions SET category_id = NULL WHERE category_id = $1', ['1']);
      expect(mockPool.query).toHaveBeenCalledWith('DELETE FROM categories WHERE id = $1', ['1']);
      expect(mockPool.query).toHaveBeenCalledWith('COMMIT');
      expect(result).toBe(true);
    });
  });
});
