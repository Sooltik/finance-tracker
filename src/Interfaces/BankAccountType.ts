export interface FinancialItem {
    name: string;
    balance: number;
}

export interface BankAccountType {
    bankName: string;
    accounts: FinancialItem[];
}
