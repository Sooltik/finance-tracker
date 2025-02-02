import { FC } from "react";

type Props = {
    isSelected: boolean;
    inputValue: number;
    setInputValue: (value: string) => void;
    handleOnSubmit: () => void;
};

const SubmitForm: FC<Props> = ({ isSelected, inputValue, setInputValue, handleOnSubmit }) => {
    return (
        <div>
            <input
                className="input-form"
                disabled={!isSelected}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
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
