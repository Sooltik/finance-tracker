import creditCardData from '../data/creditCardData.js';

const getAllCreditCards = async (req, res) => {
  try {
    const result = await creditCardData.getAllCreditCards();
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching credit cards:", err.message);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

const addCreditCard = async (req, res) => {
  const { balance, name } = req.body;
  try {
    const result = await creditCardData.addCreditCard(balance, name);
    res.status(201).json({ message: 'Credit card added', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
};

const deleteCreditCard = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await creditCardData.deleteCreditCard(id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Credit card not found" });
    }
    res.json({ message: "Credit card deleted", data: result.rows[0] });
  } catch (err) {
    console.error("Error deleting credit card:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export default { getAllCreditCards, addCreditCard, deleteCreditCard };
