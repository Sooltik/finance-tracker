import { useEffect, useState } from "react";
import "./App.css";
import SubmitForm from "./Components/SubmitForm";
import FinancialSummary from "./Components/FinancialSummary";
import BankAccount from "./Components/BankAccount";
import CreditCard from "./Components/CreditCard";
import { BankAccountsType } from "./Interfaces/BankAccountsType";
import { CreditCardsType } from "./Interfaces/CreditCardsType";

const App = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccountsType[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardsType[]>([]);
  const [assets, setAssets] = useState<number>(0);
  const [liabilities, setLiabilities] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<{ bankIndex: number; accountIndex: number } | null>(null);
  const [selectedCredit, setSelectedCredit] = useState<{ creditIndex: number } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const totalAssets = bankAccounts.reduce((sum: number, bank) =>
      sum + bank.accounts.reduce((accSum, acc) => accSum + acc.balance, 0),
      0
    );
    setAssets(totalAssets);
    const totalLiabilities = creditCards.reduce((sum: number, credit) => sum + credit.balance, 0);
    setLiabilities(totalLiabilities);
  }, [bankAccounts, creditCards]);

  const handleOnSubmit = () => {
    const value = Number(inputValue);
    if (isNaN(value) || value <= 0) return;

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

    setInputValue("");
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
        inputValue={Number(inputValue)}
        setInputValue={setInputValue}
        handleOnSubmit={handleOnSubmit}
        isSelected={selectedCredit !== null || selectedAccount !== null}
      />
    </div>
  );
};

export default App;
