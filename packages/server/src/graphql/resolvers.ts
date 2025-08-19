import { GraphQLScalarType, Kind } from 'graphql';
import * as dbService from '../services/dbService';
import { getFinancialSummary } from '../services/geminiService';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString(); // Convert outgoing Date to ISO String for JSON
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value: any) {
    if (typeof value === 'string') {
      return new Date(value); // Convert incoming ISO string to Date
    }
    throw new Error('GraphQL Date Scalar parser expected a `string`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      // Convert hard-coded AST string to Date
      return new Date(ast.value);
    }
    // Invalid hard-coded value (not a string)
    return null;
  },
});

export const resolvers = {
  Date: dateScalar,
  
  Query: {
    accounts: () => dbService.getAccounts(),
    categories: () => dbService.getCategories(),
    transactions: () => dbService.getTransactions(),
    aiSummary: async () => {
      const transactions = await dbService.getTransactions();
      if (transactions.length === 0) return null;
      return getFinancialSummary(transactions);
    }
  },

  Mutation: {
    addAccount: (_: any, { name }: { name: string }) => dbService.createAccount(name),
    updateAccount: (_: any, { id, name }: { id: string, name: string }) => dbService.updateAccount(id, name),
    deleteAccount: (_: any, { id }: { id: string }) => dbService.deleteAccount(id),
    
    addCategory: (_: any, { name }: { name: string }) => dbService.createCategory(name),
    updateCategory: (_: any, { id, name }: { id: string, name: string }) => dbService.updateCategory(id, name),
    deleteCategory: (_: any, { id }: { id: string }) => dbService.deleteCategory(id),

    addTransaction: (_: any, { input }: { input: any }) => dbService.createTransaction(input),
    updateTransaction: (_: any, { input }: { input: any }) => dbService.updateTransaction(input),
    deleteTransaction: (_: any, { id }: { id: string }) => dbService.deleteTransaction(id),

    saveTransactions: async (_: any, { transactions }: { transactions: any[] }) => {
        const saved = [];
        for(const tx of transactions) {
            saved.push(await dbService.createTransaction(tx));
        }
        return saved;
    }
  }
};
