import pool from '../config/database';

const getAllBankAccounts = async () => {
    return pool.query(`
        SELECT 
        ba.id, 
        ba.name AS name, 
        COALESCE(json_agg(a) FILTER (WHERE a.id IS NOT NULL), '[]') AS accounts 
        FROM bank_accounts ba
        LEFT JOIN accounts a ON ba.id = a.bank_accounts_id
        GROUP BY ba.id
        ORDER BY ba.name ASC;

    `);
};

const addBankAccount = async (name: string) => {
    return pool.query(
        'INSERT INTO bank_accounts (name) VALUES ($1) RETURNING *',
        [name]
    );
};

const deleteBankAccount = async (id: number) => {
    return pool.query(
        'DELETE FROM bank_accounts WHERE id = $1 RETURNING *',
        [id]
    );
};

const addAccount = async (
    name: string,
    balance: number,
    bank_account_id: number
) => {
    return pool.query(
        `INSERT INTO accounts (name, balance, bank_accounts_id) 
         VALUES ($1, $2, $3) RETURNING *`,
        [name, balance, bank_account_id]
    );
};

const deleteAccount = async (bankId: number, accountId: number) => {
    // Ensure account belongs to the bank
    const accountCheck = await pool.query(
        'SELECT * FROM accounts WHERE id = $1 AND bank_accounts_id = $2',
        [accountId, bankId]
    );

    if (accountCheck.rowCount === 0) {
        throw new Error('Account not found for this bank');
    }

    // Proceed with deletion
    const result = await pool.query(
        'DELETE FROM accounts WHERE id = $1 RETURNING *',
        [accountId]
    );

    return result; // Return the full query result, not just rows[0]
};

export default {
    getAllBankAccounts,
    addBankAccount,
    deleteBankAccount,
    addAccount,
    deleteAccount
};