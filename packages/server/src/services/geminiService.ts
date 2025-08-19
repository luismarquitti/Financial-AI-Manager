import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';
import { createFinancialSummaryPrompt, createCategorySuggestionPrompt } from '../prompts';

dotenv.config();

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set on the server.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    overallSummary: {
      type: Type.STRING,
      description: "A brief, one-sentence overview of the user's financial health based on the data."
    },
    incomeAnalysis: {
      type: Type.STRING,
      description: "A short paragraph analyzing income sources and trends."
    },
    expenseAnalysis: {
      type: Type.STRING,
      description: "A short paragraph analyzing spending habits, highlighting top categories, and identifying potential areas to save."
    },
    actionableInsights: {
      type: Type.ARRAY,
      items: { 
        type: Type.STRING 
      },
      description: "A list of 3-5 concrete, actionable suggestions for financial improvement."
    }
  },
  required: ["overallSummary", "incomeAnalysis", "expenseAnalysis", "actionableInsights"]
};

export const getFinancialSummary = async (transactions: any[]): Promise<any> => {
  const simplifiedTransactions = transactions.slice(0, 200).map(t => ({ // Limit tokens
      date: t.date.toISOString().split('T')[0],
      amount: t.amount,
      category: t.category?.name,
      description: t.description,
      account: t.account?.name,
  }));

  const prompt = createFinancialSummaryPrompt(simplifiedTransactions);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const text = response.text.trim();
    if (!text) {
        throw new Error("Received an empty response from the AI.");
    }
    const summary = JSON.parse(text);
    return summary;
  } catch (error) {
    console.error("Error fetching financial summary from Gemini API:", error);
    throw new Error("Failed to generate AI-powered financial summary. The API may be unavailable or the data could not be processed.");
  }
};

interface TransactionToCategorize {
  id: string;
  description: string;
}

interface AvailableCategory {
  id: string;
  name: string;
}

interface AISuggestion {
  transactionId: string;
  categoryName: string;
}

const suggestionResponseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            transactionId: {
                type: Type.STRING,
                description: 'The original ID of the transaction being categorized.'
            },
            categoryName: {
                type: Type.STRING,
                description: 'The name of the most appropriate category from the provided list.'
            }
        },
        required: ["transactionId", "categoryName"]
    }
};

export const suggestTransactionCategories = async (transactions: TransactionToCategorize[], categories: AvailableCategory[]): Promise<AISuggestion[]> => {
    const categoryNames = categories.map(c => c.name);
    const prompt = createCategorySuggestionPrompt(transactions, categoryNames);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionResponseSchema,
                temperature: 0.2,
            },
        });

        const text = response.text.trim();
        if (!text) {
            console.warn("Received an empty response from Gemini for category suggestion.");
            return [];
        }
        
        const suggestions: AISuggestion[] = JSON.parse(text);
        return suggestions;

    } catch (error) {
        console.error("Error fetching category suggestions from Gemini API:", error);
        throw new Error("Failed to generate AI-powered category suggestions.");
    }
};