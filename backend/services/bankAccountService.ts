import bankAccountData from '../data/bankAccountData.js';

const getAllBankAccounts = async (req, res) => {
    try {
        const result = await bankAccountData.getAllBankAccounts();
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching credit cards:", err.message);
        res.status(500).json({ message: 'Database error', error: err.message });
    }
};

const addBankAccount = async (req, res) => {
    const { name } = req.body;
    try {
        const result = await bankAccountData.addBankAccount(name);
        res.status(201).json({ message: 'Credit card added', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error' });
    }
};

const deleteBankAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await bankAccountData.deleteBankAccount(id);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Credit card not found" });
        }
        res.json({ message: "Credit card deleted", data: result.rows[0] });
    } catch (err) {
        console.error("Error deleting credit card:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

const addAccount = async (req, res) => {
    const { name, balance, bank_account_id } = req.body;

    if (!name || !bank_account_id) {
        return res.status(400).json({ message: 'Missing required fields: name and bank_account_id are required' });
    }

    try {
        const result = await bankAccountData.addAccount(
            name,
            balance || 0,
            bank_account_id
        );

        res.status(201).json({
            message: 'Account added successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add account',
            error: err.message
        });
    }
};

const deleteAccount = async (req, res) => {
    const { bankId, accountId } = req.params;
    try {
        const result = await bankAccountData.deleteAccount(bankId, accountId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Credit card not found" });
        }
        res.json({ message: "Credit card deleted", data: result.rows[0] });
    } catch (err) {
        console.error("Error deleting credit card:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
};


export default { getAllBankAccounts, addBankAccount, deleteBankAccount, addAccount, deleteAccount };
