import db from '../db';

const mapTransaction = (row: any) => ({
    id: row.id,
    date: row.date,
    description: row.description,
    amount: parseFloat(row.amount),
    category: row.category_id ? { id: row.category_id, name: row.category_name } : null,
    account: row.account_id ? { id: row.account_id, name: row.account_name } : null
});

export const getTransactions = async () => {
    const { rows } = await db.query(`
        SELECT 
            t.id, t.date, t.description, t.amount,
            c.id as category_id, c.name as category_name,
            a.id as account_id, a.name as account_name
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN accounts a ON t.account_id = a.id
        ORDER BY t.date DESC
    `);
    return rows.map(mapTransaction);
};

export const getAccounts = async () => {
    const { rows } = await db.query('SELECT id, name FROM accounts ORDER BY name');
    return rows;
};

export const getCategories = async () => {
    const { rows } = await db.query('SELECT id, name FROM categories ORDER BY name');
    return rows;
};

export const createTransaction = async (tx: any) => {
    const { date, description, amount, categoryId, accountId } = tx;
    const { rows } = await db.query(
        `INSERT INTO transactions (date, description, amount, category_id, account_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [date, description, amount, categoryId, accountId]
    );
    const { rows: result } = await db.query(`
        SELECT t.id, t.date, t.description, t.amount, c.id as category_id, c.name as category_name, a.id as account_id, a.name as account_name
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN accounts a ON t.account_id = a.id
        WHERE t.id = $1
    `, [rows[0].id]);
    return mapTransaction(result[0]);
};

export const updateTransaction = async (tx: any) => {
    const { id, date, description, amount, categoryId, accountId } = tx;
    const { rows: result } = await db.query(
        `UPDATE transactions
         SET date = $2, description = $3, amount = $4, category_id = $5, account_id = $6
         WHERE id = $1
         RETURNING (SELECT t.id, t.date, t.description, t.amount, c.id as category_id, c.name as category_name, a.id as account_id, a.name as account_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id LEFT JOIN accounts a ON t.account_id = a.id WHERE t.id = $1)`,
        [id, date, description, amount, categoryId, accountId]
    );
    return mapTransaction(result[0]);
};

export const deleteTransaction = async (id: string) => {
    await db.query('DELETE FROM transactions WHERE id = $1', [id]);
    return true;
};

export const createAccount = async (name: string) => {
    const { rows } = await db.query('INSERT INTO accounts (name) VALUES ($1) RETURNING id, name', [name]);
    return rows[0];
};

export const updateAccount = async (id: string, name: string) => {
    const { rows } = await db.query('UPDATE accounts SET name = $2 WHERE id = $1 RETURNING id, name', [id, name]);
    return rows[0];
};

export const deleteAccount = async (id: string) => {
    await db.query('BEGIN');
    await db.query('UPDATE transactions SET account_id = NULL WHERE account_id = $1', [id]);
    await db.query('DELETE FROM accounts WHERE id = $1', [id]);
    await db.query('COMMIT');
    return true;
};

export const createCategory = async (name: string) => {
    const { rows } = await db.query('INSERT INTO categories (name) VALUES ($1) RETURNING id, name', [name]);
    return rows[0];
};

export const updateCategory = async (id: string, name: string) => {
    const { rows } = await db.query('UPDATE categories SET name = $2 WHERE id = $1 RETURNING id, name', [id, name]);
    return rows[0];
};

export const deleteCategory = async (id: string) => {
    await db.query('BEGIN');
    await db.query('UPDATE transactions SET category_id = NULL WHERE category_id = $1', [id]);
    await db.query('DELETE FROM categories WHERE id = $1', [id]);
    await db.query('COMMIT');
    return true;
};
