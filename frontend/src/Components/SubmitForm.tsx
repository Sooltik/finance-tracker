import { FC } from "react";

type Props = {
    isSelected: boolean;
    amount: number;
    reason: string;
    setAmountInput: (value: number) => void;
    setReasonInput: (value: string) => void;
    handleOnSubmit: () => void;
};

const SubmitForm: FC<Props> = ({ isSelected, amount, reason, setAmountInput, setReasonInput, handleOnSubmit }) => {
    return (
        <div>
            <input
                className="input-form"
                type="number"
                disabled={!isSelected}
                value={amount}
                onChange={(e) => setAmountInput(Number(e.target.value))}
            />
            <input
                className="input-form"
                type="text"
                disabled={!isSelected}
                value={reason}
                onChange={(e) => setReasonInput(e.target.value)}
            />
            <button
                className="form-actions"
                type="button"
                disabled={!isSelected}
                onClick={handleOnSubmit}
            >
                Submit
            </button>
        </div>
    );
};

export default SubmitForm;
