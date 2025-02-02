import { FC, useState } from "react";

interface CreditCardType {
    name: string;
    balance: number;
}

type Props = {
    creditCards: CreditCardType[];
    setCreditCards: (creditCards: CreditCardType[]) => void;
    setSelectedCredit: (credit: { creditIndex: number } | null) => void;
};

const CreditCard: FC<Props> = ({ creditCards, setCreditCards, setSelectedCredit }) => {
    const [newCreditCardName, setNewCreditCardName] = useState<string>("");
    const [showAddCreditCard, setShowAddCreditCard] = useState<boolean>(false);

    const handleAddCreditCard = () => {
        if (newCreditCardName.trim() === "") return;

        const newCreditCard: CreditCardType = {
            name: newCreditCardName,
            balance: 0,
        };

        setCreditCards([...creditCards, newCreditCard]);
        setNewCreditCardName("");
        setShowAddCreditCard(false);
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
                        value={newCreditCardName}
                        onChange={(e) => setNewCreditCardName(e.target.value)}
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
                    </div>
                ))
            ) : (
                <p>No credit cards added yet</p>
            )}
        </div>
    );
};

export default CreditCard;
