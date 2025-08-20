import { getFinancialSummary } from './geminiService';
import { GoogleGenAI } from '@google/genai';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { Transaction, AiSummary } from '../types';

// Mock the entire @google/genai module
const mockGenerateContent = jest.fn();
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
  Type: {
    OBJECT: 'OBJECT',
    STRING: 'STRING',
    ARRAY: 'ARRAY',
  }
}));

describe('geminiService', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockGenerateContent.mockClear();
    // Reset any environment variables if they were changed
    process.env.API_KEY = 'test-key';
  });

  const mockTransactions: Transaction[] = [
    { id: '1', date: new Date('2023-01-15'), description: 'Paycheck', amount: 5000, category: 'Income', account: 'Checking' },
    { id: '2', date: new Date('2023-01-20'), description: 'Groceries', amount: -150, category: 'Food', account: 'Checking' },
    { id: '3', date: new Date('2023-01-22'), description: 'Dinner Out', amount: -75, category: 'Food', account: 'Credit Card' },
  ];

  it('should return a valid financial summary on successful API call', async () => {
    const mockAiSummary: AiSummary = {
      overallSummary: "You're doing great.",
      incomeAnalysis: "Strong income stream.",
      expenseAnalysis: "Spending is under control.",
      actionableInsights: ["Keep it up!"],
    };

    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockAiSummary),
    });

    const summary = await getFinancialSummary(mockTransactions);

    expect(summary).toEqual(mockAiSummary);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the API returns an empty response', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '',
    });

    await expect(getFinancialSummary(mockTransactions)).rejects.toThrow(
      'Received an empty response from the AI.'
    );
  });

  it('should throw a generic error if the API call fails', async () => {
    const apiError = new Error('API is down');
    mockGenerateContent.mockRejectedValue(apiError);

    await expect(getFinancialSummary(mockTransactions)).rejects.toThrow(
      'Failed to generate AI-powered financial summary. The API may be unavailable or the data could not be processed.'
    );
  });

  it('should throw an error if the API_KEY is not set', async () => {
    // This requires a bit of a trick with Jest to re-evaluate the module
    delete process.env.API_KEY;

    // Use require to re-import and test the module-level check
    await expect(async () => {
        jest.resetModules();
        await import('./geminiService');
    }).rejects.toThrow('API_KEY environment variable is not set.');

    // Restore for other tests
    process.env.API_KEY = 'test-key';
  });
});
