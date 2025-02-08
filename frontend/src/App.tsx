import { useEffect, useState } from "react";
import "./App.css";
import SubmitForm from "./Components/SubmitForm";
import FinancialSummary from "./Components/FinancialSummary";
import BankAccount from "./Components/BankAccount";
import CreditCard from "./Components/CreditCard";
import { BankAccountType as BankAccountType } from "./Interfaces/BankAccountType";
import { CreditCardsType } from "./Interfaces/CreditCardType";
import { Transaction as TransactionType } from "./Interfaces/TransactionType";

const App = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardsType[]>([]);
  const [assets, setAssets] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<{ bankIndex: number; accountIndex: number } | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<{ creditIndex: number } | null>(null);
  const [amountInput, setAmountInput] = useState<number>(0);
  const [reasonInput, setReasonInput] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionType[]>([]);

  useEffect(() => {
    const totalBalance = (bankAccounts || []).reduce((sum, bank) => {
      return sum + (bank.accounts ? bank.accounts.reduce((accSum, acc) => accSum + acc.balance, 0) : 0);
    }, 0);

    setAssets(totalBalance);
    const totalLiabilities = creditCards.reduce((sum: number, credit) => sum + credit.balance, 0);
    setLiabilities(totalLiabilities);
  }, [bankAccounts, creditCards]);

  const handleOnSubmit = () => {
    const value = Number(amountInput);
    // Allow positive (deposits) and negative (withdrawals) values but ignore 0
    if (isNaN(value) || value === 0) return;

    // Create a new transaction object with the current date
    const newTransaction: TransactionType = {
      date: new Date(),
      reason: reasonInput,
      amount: value,
    };

    // Update the balance on the selected account or credit card
    if (selectedAccount) {
      const updatedBanks = [...bankAccounts];
      updatedBanks[selectedAccount.bankIndex].accounts[selectedAccount.accountIndex].balance += value;
      setBankAccounts(updatedBanks);
    }

    if (selectedCredit) {
      const updatedCredit = [...creditCards];
      updatedCredit[selectedCredit.creditIndex].balance += value;
      setCreditCards(updatedCredit);
    }

    // Update the transaction history by appending the new transaction
    setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

    // Clear inputs and selections
    setAmountInput(0);
    setReasonInput("");
    setSelectedAccount(null);
    setSelectedCredit(null);
  };

  return (
    <div className="container">
      <div className="cards-container">
        <FinancialSummary assets={assets} liabilities={liabilities} />
        <BankAccount
          bankAccounts={bankAccounts}
          setBankAccounts={setBankAccounts}
          setSelectedAccount={setSelectedAccount}
        />
        <CreditCard
          creditCards={creditCards}
          setCreditCards={setCreditCards}
          setSelectedCredit={setSelectedCredit}
        />
      </div>
      <SubmitForm
        amount={Number(amountInput)}
        reason={reasonInput}
        setAmountInput={setAmountInput}
        setReasonInput={setReasonInput}
        handleOnSubmit={handleOnSubmit}
        isSelected={selectedCredit !== null || selectedAccount !== null}
      />
      <div className="transaction-history">
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <p>
                <strong>{transaction.date.toLocaleString()}:</strong> {transaction.reason}{" "}
                {transaction.amount >= 0 ? `+${transaction.amount}` : transaction.amount}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
