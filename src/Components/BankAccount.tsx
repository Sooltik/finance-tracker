import { FC, useState } from "react";
import Account from "./Account";
import { BankAccountType } from "../Interfaces/bankAccountType";

type Props = {
    bankAccounts: BankAccountType[];
    setBankAccounts: (banks: BankAccountType[]) => void;
    setSelectedAccount: (account: { bankIndex: number; accountIndex: number } | null) => void;
};

const BankAccount: FC<Props> = ({ bankAccounts, setBankAccounts, setSelectedAccount }) => {
    const [newBankName, setNewBankName] = useState<string>("");
    const [selectedBankIndex, setSelectedBankIndex] = useState<number | null>(null);
    const [newAccountName, setNewAccountName] = useState<string>("");
    const [showAddAccount, setShowAddAccount] = useState<boolean>(false);
    const [showAddBankInput, setShowAddBankInput] = useState<boolean>(false);

    const handleAddBank = () => {
        if (newBankName.trim() === "") return;

        const newBank: BankAccountType = {
            bankName: newBankName,
            accounts: [],
        };

        setBankAccounts([...bankAccounts, newBank]);
        setNewBankName("");
        setShowAddBankInput(false);
    };

    const handleAddAccount = () => {
        if (newAccountName.trim() === "" || selectedBankIndex === null) return;

        const updatedBanks = [...bankAccounts];
        updatedBanks[selectedBankIndex].accounts.push({
            name: newAccountName,
            balance: 0,
        });

        setBankAccounts(updatedBanks);
        setNewAccountName("");
        setShowAddAccount(false);
    };

    const handleBankSelect = (bankIndex: number) => {
        setSelectedBankIndex(bankIndex);
        setShowAddAccount(true);
    };

    return (
        <div>
            <h2>Bank Accounts</h2>
            <div className="section-header">
                {!showAddBankInput && (
                    <button
                        className="primary"
                        onClick={() => setShowAddBankInput(true)}
                    >
                        + Add Bank
                    </button>
                )}
            </div>

            {showAddBankInput && (
                <div className="input-group">
                    <input
                        className="input-form"
                        type="text"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        placeholder="Bank name"
                    />
                    <div className="form-actions">
                        <button
                            className="secondary"
                            onClick={() => setShowAddBankInput(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="primary"
                            onClick={handleAddBank}
                        >
                            Add Bank
                        </button>
                    </div>
                </div>
            )}
            <hr />
            {bankAccounts.length === 0 ? (
                <p>No banks have been added yet</p>
            ) : (
                bankAccounts.map((bank, bankIndex) => (
                    <div key={bankIndex} className="bank-card">
                        <button onClick={() => handleBankSelect(bankIndex)}>
                            <h3>{bank.bankName}</h3>
                        </button>
                        <div className="account-item">
                            {bank.accounts.length > 0 ? (
                                bank.accounts.map((account, accIndex) => (
                                    <Account
                                        key={accIndex}
                                        accountName={account.name}
                                        accountBalance={account.balance}
                                        onSelect={() => setSelectedAccount({ bankIndex, accountIndex: accIndex })}
                                    />
                                ))
                            ) : (
                                <p>No accounts added yet</p>
                            )}
                        </div>
                        {selectedBankIndex === bankIndex && showAddAccount && (
                            <div>
                                <h4>Add an Account to {bank.bankName}</h4>
                                <input
                                    className="input-form"
                                    type="text"
                                    value={newAccountName}
                                    onChange={(e) => setNewAccountName(e.target.value)}
                                    placeholder="Enter account name"
                                />
                                <div className="form-actions">
                                    <button className="secondary" onClick={() => setShowAddAccount(false)}>
                                        Cancel
                                    </button>
                                    <button className="primary" onClick={handleAddAccount}>
                                        Add Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default BankAccount;