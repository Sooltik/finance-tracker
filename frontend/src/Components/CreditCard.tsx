import { FC, useEffect, useState } from "react";
import axios from 'axios';
interface CreditCardType {
    id: number;
    name: string;
    balance: number;
}

type Props = {
    creditCards: CreditCardType[];
    setCreditCards: (creditCards: CreditCardType[]) => void;
    setSelectedCredit: (credit: { creditIndex: number } | null) => void;
};

const CreditCard: FC<Props> = ({ creditCards, setCreditCards, setSelectedCredit }) => {
    const [creditCardName, setCreditCardName] = useState<string>("");
    const [showAddCreditCard, setShowAddCreditCard] = useState<boolean>(false);

    useEffect(() => {
        const getCreditCards = async () => {
            try {
                const response = await axios.get('http://localhost:5000/credit-cards');
                setCreditCards(response.data);
            } catch (error) {
                console.error("Error fetching credit cards:", error);
            }
        };
        getCreditCards();
    }, []);


    const handleAddCreditCard = async () => {
        if (creditCardName.trim() === "") return;

        try {
            const response = await axios.post('http://localhost:5000/credit-cards', {
                name: creditCardName,
                balance: 0,
            });

            setCreditCards([...creditCards, response.data.data]);
            setCreditCardName("");
            setShowAddCreditCard(false);
        } catch (err) {
            console.error("Error adding credit card", err);
        }
    };

    const handleDeleteCreditCard = async (id: number) => {
        try {
            await axios.delete(`http://localhost:5000/credit-cards/${id}`);

            setCreditCards(creditCards.filter(card => card.id !== id));
        } catch (err) {
            console.error("Error deleting credit card", err);
        }
    };


    return (
        <div>
            <h2>Credit Cards:</h2>
            <div className="section-header">
                {!showAddCreditCard && (
                    <button className="primary" onClick={() => setShowAddCreditCard(true)}>
                        + Add Credit Card
                    </button>
                )}
            </div>
            {showAddCreditCard && (
                <div className="input-group">
                    <input
                        className="input-form"
                        type="text"
                        value={creditCardName}
                        onChange={(e) => setCreditCardName(e.target.value)}
                        placeholder="Enter credit card name"
                    />
                    <div className="form-actions">
                        <button
                            className="secondary"
                            onClick={() => setShowAddCreditCard(false)}
                        >
                            Cancel
                        </button>
                        <button className="primary" onClick={handleAddCreditCard}>
                            Add Credit Card
                        </button>
                    </div>
                </div>
            )}
            <hr />
            {creditCards.length > 0 ? (
                creditCards.map((creditCard, creditIndex) => (
                    <div key={creditIndex} className="credit-card">
                        <button onClick={() => setSelectedCredit({ creditIndex })}>
                            <h3>{creditCard.name}: {creditCard.balance}$</h3>
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteCreditCard(creditCard.id)}>
                            Delete Credit Card ❌
                        </button>
                    </div>
                ))
            ) : (
                <p>No credit cards added yet</p>
            )}
        </div>
    );
};

export default CreditCard;
