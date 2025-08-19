import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Use Node.js globals __filename and __dirname directly

interface RawTransaction {
    Date: string;
    Description: string;
    Amount: number;
    Category: string;
    Account: string;
}

const seed = async () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    console.log('Connected to database for seeding...');

    try {
        // Read schema and create tables
        console.log('Creating database schema...');
        const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
        await client.query(schemaSql);
        console.log('Schema created successfully.');

        // Read transaction data
    const dataPath = path.join(__dirname, '../../../../data/transactions.json');
        const transactionsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as RawTransaction[];
        
        // Extract unique accounts and categories
        const accountNames = [...new Set(transactionsData.map(t => t.Account).filter(Boolean))];
        const categoryNames = [...new Set(transactionsData.map(t => t.Category).filter(Boolean))];

        // Insert accounts and get their IDs
        console.log('Seeding accounts...');
        const accountIdMap = new Map<string, number>();
        for (const name of accountNames) {
            const res = await client.query('INSERT INTO accounts (name) VALUES ($1) RETURNING id', [name]);
            accountIdMap.set(name, res.rows[0].id);
        }
        console.log(`${accountNames.length} accounts seeded.`);

        // Insert categories and get their IDs
        console.log('Seeding categories...');
        const categoryIdMap = new Map<string, number>();
        for (const name of categoryNames) {
            const res = await client.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [name]);
            categoryIdMap.set(name, res.rows[0].id);
        }
        console.log(`${categoryNames.length} categories seeded.`);
        
        // Insert transactions
        console.log('Seeding transactions...');
        let seededCount = 0;
        await client.query('BEGIN'); // Start transaction
        for (const t of transactionsData) {
            const accountId = t.Account ? accountIdMap.get(t.Account) : null;
            const categoryId = t.Category ? categoryIdMap.get(t.Category) : null;
            
            await client.query(
                `INSERT INTO transactions (date, description, amount, account_id, category_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [t.Date, t.Description, t.Amount, accountId, categoryId]
            );
            seededCount++;
        }
        await client.query('COMMIT'); // Commit transaction
        console.log(`${seededCount} transactions seeded.`);

        console.log('Database seeding completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error('Error seeding database:', error);
    } finally {
        client.release();
        await pool.end();
        console.log('Database connection closed.');
    }
};

seed().catch(err => {
    console.error("Failed to execute seeding script:", err);
});