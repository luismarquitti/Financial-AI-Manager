import { gql } from '@apollo/client';

const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    date
    description
    amount
    category {
      id
      name
    }
    account {
      id
      name
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query GetAccounts {
    accounts {
      id
      name
    }
  }
`;

export const GET_AI_SUMMARY = gql`
  query GetAiSummary {
    aiSummary {
      overallSummary
      incomeAnalysis
      expenseAnalysis
      actionableInsights
    }
  }
`;

// Mutations
export const ADD_TRANSACTION = gql`
    mutation AddTransaction($input: AddTransactionInput!) {
        addTransaction(input: $input) {
            ...TransactionFields
        }
    }
    ${TRANSACTION_FIELDS}
`;

export const UPDATE_TRANSACTION = gql`
    mutation UpdateTransaction($input: UpdateTransactionInput!) {
        updateTransaction(input: $input) {
            ...TransactionFields
        }
    }
    ${TRANSACTION_FIELDS}
`;

export const DELETE_TRANSACTION = gql`
    mutation DeleteTransaction($id: ID!) {
        deleteTransaction(id: $id)
    }
`;

export const SAVE_TRANSACTIONS = gql`
    mutation SaveTransactions($transactions: [AddTransactionInput!]!) {
        saveTransactions(transactions: $transactions) {
            ...TransactionFields
        }
    }
    ${TRANSACTION_FIELDS}
`;

export const ADD_CATEGORY = gql`
    mutation AddCategory($name: String!) {
        addCategory(name: $name) {
            id
            name
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($id: ID!, $name: String!) {
        updateCategory(id: $id, name: $name) {
            id
            name
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id)
    }
`;

export const ADD_ACCOUNT = gql`
    mutation AddAccount($name: String!) {
        addAccount(name: $name) {
            id
            name
        }
    }
`;

export const UPDATE_ACCOUNT = gql`
    mutation UpdateAccount($id: ID!, $name: String!) {
        updateAccount(id: $id, name: $name) {
            id
            name
        }
    }
`;

export const DELETE_ACCOUNT = gql`
    mutation DeleteAccount($id: ID!) {
        deleteAccount(id: $id)
    }
`;
