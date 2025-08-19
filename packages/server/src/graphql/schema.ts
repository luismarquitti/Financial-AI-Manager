export const typeDefs = `#graphql
  scalar Date

  type Account {
    id: ID!
    name: String!
  }

  type Category {
    id: ID!
    name: String!
  }

  type Transaction {
    id: ID!
    date: Date!
    description: String!
    amount: Float!
    category: Category
    account: Account
  }

  type AiSummary {
    overallSummary: String!
    incomeAnalysis: String!
    expenseAnalysis: String!
    actionableInsights: [String!]!
  }
  
  input AddTransactionInput {
    date: Date!
    description: String!
    amount: Float!
    categoryId: ID
    accountId: ID
  }
  
  input UpdateTransactionInput {
    id: ID!
    date: Date
    description: String
    amount: Float
    categoryId: ID
    accountId: ID
  }

  type Query {
    accounts: [Account!]!
    categories: [Category!]!
    transactions: [Transaction!]!
    aiSummary: AiSummary
  }

  type Mutation {
    addAccount(name: String!): Account!
    updateAccount(id: ID!, name: String!): Account!
    deleteAccount(id: ID!): Boolean!
    
    addCategory(name: String!): Category!
    updateCategory(id: ID!, name: String!): Category!
    deleteCategory(id: ID!): Boolean!

    addTransaction(input: AddTransactionInput!): Transaction!
    updateTransaction(input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
    
    saveTransactions(transactions: [AddTransactionInput!]!): [Transaction!]!
  }
`;
