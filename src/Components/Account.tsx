import { FC } from "react";

interface AccountProps {
  accountName: string;
  accountBalance: number;
  onSelect: () => void;
}

const Account: FC<AccountProps> = ({ accountName, accountBalance, onSelect }) => {
  return (
    <button type="button" onClick={onSelect}>
      <p>{accountName}: {accountBalance}$</p>
    </button>
  );
};

export default Account;
