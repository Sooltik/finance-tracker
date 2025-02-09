import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import SubmitForm from "./Components/SubmitForm";
import FinancialSummary from "./Components/FinancialSummary";
import BankAccount from "./Components/BankAccount";
import CreditCard from "./Components/CreditCard";
import { BankAccountType } from "./Interfaces/BankAccountType";
import { CreditCardsType } from "./Interfaces/CreditCardType";
import { Transaction } from "./Interfaces/TransactionType";

const App = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardsType[]>([]);
  const [assets, setAssets] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<{ bankIndex: number; accountIndex: number } | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<{ creditIndex: number } | null>(null);
  const [amountInput, setAmountInput] = useState<number>(0);
  const [reasonInput, setReasonInput] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const totalBalance = (bankAccounts || []).reduce((sum, bank) => {
      return sum + (bank.accounts ? bank.accounts.reduce((accSum, acc) => accSum + acc.balance, 0) : 0);
    }, 0);

    setAssets(totalBalance);
    const totalLiabilities = creditCards.reduce((sum: number, credit) => sum + credit.balance, 0);
    setLiabilities(totalLiabilities);
  }, [bankAccounts, creditCards]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/transactions");
        const fetchedTransactions = response.data.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };

    fetchTransactions();
  }, []);

  const handleOnSubmit = async () => {
    const value = Number(amountInput);
    if (isNaN(value) || value === 0) return;

    let accountType: "bank" | "credit" | null = null;
    let accountId: number | null = null;

    // Immutably update bankAccounts if a bank account is selected
    if (selectedAccount) {
      accountType = "bank";
      const updatedBanks = bankAccounts.map((bank, bankIndex) => {
        if (bankIndex === selectedAccount.bankIndex) {
          return {
            ...bank,
            accounts: bank.accounts.map((account, accIndex) => {
              if (accIndex === selectedAccount.accountIndex) {
                return { ...account, balance: account.balance + value };
              }
              return account;
            }),
          };
        }
        return bank;
      });
      setBankAccounts(updatedBanks);
      accountId = bankAccounts[selectedAccount.bankIndex].accounts[selectedAccount.accountIndex].id;
    }

    // Immutably update creditCards if a credit card is selected
    if (selectedCredit) {
      accountType = "credit";
      const updatedCredit = creditCards.map((card, creditIndex) => {
        if (creditIndex === selectedCredit.creditIndex) {
          return { ...card, balance: card.balance + value };
        }
        return card;
      });
      setCreditCards(updatedCredit);
      accountId = creditCards[selectedCredit.creditIndex].id;
    }

    if (!accountType || accountId === null) return;

    const newTransaction: Transaction = {
      date: new Date(),
      reason: reasonInput,
      amount: value,
      accountType,
      accountId,
    };

    try {
      const response = await axios.post("http://localhost:5000/transactions", newTransaction);
      newTransaction.id = response.data.data.id;
    } catch (err) {
      console.error("Error saving transaction to DB", err);
      // Optionally revert the optimistic update if the POST request fails
      // This would require storing the previous state and resetting it here
      return;
    }

    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

    setAmountInput(0);
    setReasonInput("");
    setSelectedAccount(null);
    setSelectedCredit(null);
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      await axios.delete(`http://localhost:5000/transactions/${transactionId}`);
      setTransactions((prev) =>
        prev.filter((t) => t.id !== transactionId)
      );
    } catch (err) {
      console.error("Error deleting transaction", err);
    }
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
        amount={amountInput}
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
          transactions.map((transaction, index) => {
            let accountName = "";
            if (transaction.accountType === "bank") {
              for (const bank of bankAccounts) {
                const foundAccount = bank.accounts.find((acc) => acc.id === transaction.accountId);
                if (foundAccount) {
                  accountName = `${bank.name} - ${foundAccount.name}`;
                  break;
                }
              }
            } else if (transaction.accountType === "credit") {
              const foundCard = creditCards.find((card) => card.id === transaction.accountId);
              if (foundCard) {
                accountName = foundCard.name;
              }
            }
            return (
              <div key={index} className="transaction">
                <p>
                  <strong>{new Date(transaction.date).toLocaleString()}:</strong> {transaction.reason}{" "}
                  {transaction.amount >= 0 ? `+${transaction.amount}` : transaction.amount} on {accountName}
                </p>
                <button
                  onClick={() => handleDeleteTransaction(transaction.id!)}
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;
