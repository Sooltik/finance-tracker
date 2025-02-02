export interface AccountsType {
    id?: number;
    name: string;
    balance: number;
}

export interface BankAccountsType {
    id?: number;
    bankName: string;
    accounts: AccountsType[];
}
