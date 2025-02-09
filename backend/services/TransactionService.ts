import transactionData from "../data/transactionData";
import pool from "../config/database";

const addTransaction = async (req, res) => {
  const { date, reason, amount, accountType, accountId } = req.body;
  if (!date || !reason || !amount || !accountType || !accountId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transactionResult = await client.query(
      `INSERT INTO transactions (date, reason, amount, account_type, account_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [date, reason, amount, accountType, accountId]
    );

    if (accountType === "bank") {
      await client.query(
        `UPDATE accounts SET balance = balance + $1 WHERE id = $2`,
        [amount, accountId]
      );
    } else if (accountType === "credit") {
      await client.query(
        `UPDATE credit_cards SET balance = balance + $1 WHERE id = $2`,
        [amount, accountId]
      );
    }

    await client.query("COMMIT");

    res
      .status(201)
      .json({ message: "Transaction created and account updated", data: transactionResult.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error adding transaction", err);
    res.status(500).json({ message: "Database error", error: err.message });
  } finally {
    client.release();
  }
};

const getTransactions = async (req, res) => {
  try {
    const result = await transactionData.getTransactions();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching transactions", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT * FROM transactions WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Transaction not found" });
    }
    const transaction = rows[0];

    await client.query(`DELETE FROM transactions WHERE id = $1`, [id]);

    if (transaction.account_type === "bank") {
      await client.query(
        `UPDATE accounts SET balance = balance - $1 WHERE id = $2`,
        [transaction.amount, transaction.account_id]
      );
    } else if (transaction.account_type === "credit") {
      await client.query(
        `UPDATE credit_cards SET balance = balance - $1 WHERE id = $2`,
        [transaction.amount, transaction.account_id]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Transaction deleted and account updated" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting transaction", err);
    res.status(500).json({ message: "Database error", error: err.message });
  } finally {
    client.release();
  }
};

export default { addTransaction, getTransactions, deleteTransaction };
