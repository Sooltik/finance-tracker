require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const client = require('./database');

// Middleware
app.use(cors());
app.use(express.json());

app.post('/add-credit-card', async (req, res) => {
    const { balance, name } = req.body;
    try {
        const query = `
          INSERT INTO credit_cards (balance, name)
          VALUES ($1, $2)
          RETURNING *;
        `;
        const values = [balance, name];

        const result = await client.query(query, values);
        res.status(201).json({ message: 'Credit card added', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
});

app.delete('/delete-credit-card/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM credit_cards WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Credit card not found" });
        }
        res.json({ message: "Credit card deleted", data: result.rows[0] });
    } catch (err) {
        console.error("Error deleting credit card:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

app.get('/get-credit-cards', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM credit_cards ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching credit cards:", err.message);
        res.status(500).json({ message: 'Database error', error: err.message });
    }
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
