import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('Connected to the database!');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    (process as any).exit(-1);
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
