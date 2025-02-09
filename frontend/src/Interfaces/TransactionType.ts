export interface Transaction {
    id?: number;
    date: Date;
    reason: string;
    amount: number;
    accountType: "bank" | "credit";
    accountId: number;
  }
  