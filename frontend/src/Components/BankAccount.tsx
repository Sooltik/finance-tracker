import { FC, useEffect, useState } from "react";
import Account from "./Account";
import { BankAccountType } from "../Interfaces/BankAccountType";
import axios from "axios";

type Props = {
    bankAccounts: BankAccountType[];
    setBankAccounts: React.Dispatch<React.SetStateAction<BankAccountType[]>>;
    setSelectedAccount: (account: { bankIndex: number; accountIndex: number } | null) => void;
};

const BankAccount: FC<Props> = ({ bankAccounts, setBankAccounts, setSelectedAccount }) => {
    const [bankName, setBankName] = useState<string>("");
    const [selectedBankIndex, setSelectedBankIndex] = useState<number | null>(null);
    const [accountName, setAccountName] = useState<string>("");
    const [showAddAccount, setShowAddAccount] = useState<boolean>(false);
    const [showAddBankInput, setShowAddBankInput] = useState<boolean>(false);

    useEffect(() => {
        const getBankAccounts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/bank-accounts');
                setBankAccounts(response.data);
            } catch (error) {
                console.error("Error fetching bank accounts:", error);
            }
        };
        getBankAccounts();
    }, [bankName, accountName]);

    const handleAddBank = async () => {
        if (bankName.trim() === "") return;

        try {
            const response = await axios.post('http://localhost:5000/bank-accounts', {
                name: bankName,
            });
            const newBank = { ...response.data, accounts: response.data.accounts || [] };
            setBankAccounts([...bankAccounts, newBank]);
            setBankName("");
            setShowAddBankInput(false);
        } catch (err) {
            console.error("Error adding bank account", err);
        }
    };


    const handleDeleteBankAccount = async (id: number) => {
        try {
            await axios.delete(`http://localhost:5000/bank-accounts/${id}`);
            setBankAccounts(bankAccounts.filter(bank => bank.id !== id));
        } catch (err) {
            console.error("Error deleting bank account", err);
        }
    };

    const handleAddAccount = async () => {
        if (accountName.trim() === "" || selectedBankIndex === null) return;

        const selectedBank = bankAccounts[selectedBankIndex];
        if (!selectedBank) return;

        try {
            const response = await axios.post(
                `http://localhost:5000/bank-accounts/${selectedBank.id}/accounts`,
                {
                    name: accountName,
                    balance: 0,
                    bank_account_id: selectedBank.id,
                }
            );

            setBankAccounts(prevBanks =>
                prevBanks.map(bank =>
                    bank.id === selectedBank.id
                        ? { ...bank, accounts: [...bank.accounts, response.data] }
                        : bank
                )
            );

            setAccountName("");
            setShowAddAccount(false);
        } catch (err) {
            console.error("Error adding account", err);
        }
    };

    const handleDeleteAccount = async (bankId: number, accountId: number) => {
        try {
            await axios.delete(
                `http://localhost:5000/bank-accounts/${bankId}/accounts/${accountId}`
            );
    
            // Update state to remove the deleted account
            setBankAccounts(prevBanks =>
                prevBanks.map(bank => {
                    if (bank.id === bankId) {
                        return {
                            ...bank,
                            accounts: bank.accounts.filter(acc => acc.id !== accountId)
                        };
                    }
                    return bank;
                })
            );
        } catch (err) {
            console.error("Error deleting account:", err);
        }
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
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
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
                    <div key={bank?.id ?? `bank-${bankIndex}`} className="bank-card">
                        <button onClick={() => handleBankSelect(bankIndex)}>
                            <h3>{bank?.name}</h3>
                        </button>
                        <button className="delete-button" onClick={() => handleDeleteBankAccount(bank?.id)}>
                            Delete Bank Account ❌
                        </button>
                        <div className="account-item">
                            {(bank.accounts || []).length > 0 ? (
                                (bank.accounts || []).map((account) => (
                                    <div key={`${bank?.id}-temp-${Math.random()}`}>
                                        <Account
                                            name={account?.name}
                                            balance={account?.balance}
                                            onSelect={() =>
                                                setSelectedAccount({
                                                    bankIndex,
                                                    accountIndex: bank.accounts.indexOf(account),
                                                })
                                            }
                                            onDelete={() => handleDeleteAccount(bank.id, account.id)}
                                        />
                                    </div>
                                )
                                )
                            ) : (
                                <p>No accounts added yet</p>
                            )}

                        </div>
                        {selectedBankIndex === bankIndex && showAddAccount && (
                            <div>
                                <h4>Add an Account to {bank?.name}</h4>
                                <input
                                    className="input-form"
                                    type="text"
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
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