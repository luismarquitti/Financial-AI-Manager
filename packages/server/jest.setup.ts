import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { beforeAll, afterAll } from '@jest/globals';

dotenv.config({ path: './.env.test' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  const client = await pool.connect();
  try {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const schemaSql = fs.readFileSync(path.join(__dirname, 'src/db/schema.sql'), 'utf-8');
    await client.query(schemaSql);

    const dataPath = path.join(__dirname, '../client/public/data/transactions.json');
    const transactionsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const accountNames = [...new Set(transactionsData.map((t: any) => t.Account).filter(Boolean))];
    const categoryNames = [...new Set(transactionsData.map((t: any) => t.Category).filter(Boolean))];

    const accountIdMap = new Map();
    for (const name of accountNames) {
        const res = await client.query('INSERT INTO accounts (name) VALUES ($1) RETURNING id', [name]);
        accountIdMap.set(name, res.rows[0].id);
    }

    const categoryIdMap = new Map();
    for (const name of categoryNames) {
        const res = await client.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [name]);
        categoryIdMap.set(name, res.rows[0].id);
    }

    await client.query('BEGIN');
    for (const t of transactionsData) {
        const accountId = t.Account ? accountIdMap.get(t.Account) : null;
        const categoryId = t.Category ? categoryIdMap.get(t.Category) : null;

        await client.query(
            `INSERT INTO transactions (date, description, amount, account_id, category_id)
             VALUES ($1, $2, $3, $4, $5)`,
            [t.Date, t.Description, t.Amount, accountId, categoryId]
        );
    }
    await client.query('COMMIT');

  } finally {
    client.release();
  }
});

afterAll(async () => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS transactions, categories, accounts;');
  } finally {
    client.release();
    await pool.end();
  }
});
