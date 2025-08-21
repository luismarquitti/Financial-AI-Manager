import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../src/graphql/schema';
import { resolvers } from '../src/graphql/resolvers';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import db from '../src/db';

let testServer: ApolloServer;

beforeAll(() => {
  testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
});

afterAll(async () => {
  await db.query('DROP TABLE IF EXISTS transactions, categories, accounts;');
});

describe('GraphQL Resolvers', () => {
  it('should fetch all accounts', async () => {
    const response = await testServer.executeOperation({
      query: 'query { accounts { id, name } }',
    });

    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
        const result: any = response.body.singleResult;
        expect(result.errors).toBeUndefined();
        expect(result.data?.accounts.length).toBeGreaterThan(0);
        // Add more specific assertions based on your seed data
        const accountNames = result.data?.accounts.map((a: any) => a.name);
        expect(accountNames).toContain('Main Account');
    }
  });
});
