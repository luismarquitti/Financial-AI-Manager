
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, AiSummary } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
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

export const getFinancialSummary = async (transactions: Transaction[]): Promise<AiSummary> => {
  const simplifiedTransactions = transactions.slice(0, 200).map(t => ({ // Limit tokens
      date: t.date.toISOString().split('T')[0],
      amount: t.amount,
      category: t.category,
      description: t.description,
      account: t.account,
  }));

  const prompt = `
    Analyze the following financial transactions from one or more accounts.
    A positive amount indicates income, and a negative amount indicates an expense.
    Provide a concise and helpful financial summary. Consider trends across different accounts if applicable.
    Transactions:
    ${JSON.stringify(simplifiedTransactions)}
  `;

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
    const summary: AiSummary = JSON.parse(text);
    return summary;
  } catch (error) {
    console.error("Error fetching financial summary from Gemini API:", error);
    throw new Error("Failed to generate AI-powered financial summary. The API may be unavailable or the data could not be processed.");
  }
};