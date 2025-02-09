import express from "express";
import creditCardService from '../services/creditCardService';
import bankAccountService from '../services/bankAccountService';
import transactionService from '../services/TransactionService';

const router = express.Router();

// Credit Card Routes
router.get("/credit-cards", creditCardService.getAllCreditCards);
router.post("/credit-cards", creditCardService.addCreditCard);
router.delete("/credit-cards/:id", creditCardService.deleteCreditCard);

// Bank Account Routes
router.get("/bank-accounts", bankAccountService.getAllBankAccounts);
router.post("/bank-accounts", bankAccountService.addBankAccount);
router.delete("/bank-accounts/:id", bankAccountService.deleteBankAccount);

// Account Routes (nested under bank accounts)
router.post("/bank-accounts/:bankId/accounts", bankAccountService.addAccount);
router.delete("/bank-accounts/:bankId/accounts/:accountId", bankAccountService.deleteAccount);

// Transaction Routes
router.post("/transactions", transactionService.addTransaction);
router.get("/transactions", transactionService.getTransactions);
router.delete("/transactions/:id", transactionService.deleteTransaction);

export default router;