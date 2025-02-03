import { FC,  } from "react";
interface AccountProps {
  name: string;
  balance: number;
  onSelect: () => void;
  onDelete: () => void;
}

const Account: FC<AccountProps> = ({ name: accountName, balance: accountBalance, onSelect, onDelete }) => {
  return (
    <>
      <button type="button" onClick={onSelect}>
        <p>{accountName}: {accountBalance}$</p>
      </button>
      <button className="delete-button" onClick={onDelete}>
        Delete Account ❌
      </button>
    </>
  );
};

export default Account;

