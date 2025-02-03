export interface AccountType {
    id: number;
    name: string;
    balance: number;
}

export interface BankAccountType {
    id: number;
    name: string;
    accounts: AccountType[];
}
