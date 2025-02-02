import pool from '../config/database';

const getAllCreditCards = async () => {
    return pool.query('SELECT * FROM credit_cards ORDER BY name ASC');
};

const addCreditCard = async (balance, name) => {
    return pool.query(
        'INSERT INTO credit_cards (balance, name) VALUES ($1, $2) RETURNING *',
        [balance, name]
    );
};

const deleteCreditCard = async (id) => {
    return pool.query('DELETE FROM credit_cards WHERE id = $1 RETURNING *', [id]);
};

export default { getAllCreditCards, addCreditCard, deleteCreditCard };
