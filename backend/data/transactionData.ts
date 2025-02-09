import pool from "../config/database";

const addTransaction = async (
  date: Date,
  reason: string,
  amount: number,
  accountType: string,
  accountId: number
) => {
  return pool.query(
    `INSERT INTO transactions (date, reason, amount, account_type, account_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [date, reason, amount, accountType, accountId]
  );
};

const getTransactions = async () => {
  return pool.query(`SELECT * FROM transactions ORDER BY date DESC`);
};

export default { addTransaction, getTransactions };
