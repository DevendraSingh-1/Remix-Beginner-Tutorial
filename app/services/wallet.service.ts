// app/services/wallet.service.ts
export interface Wallet {
    walletId: string;
    userId: string;
    balance: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Transaction {
    transactionId: string;
    walletId: string;
    type: "Credit" | "Debit";
    amount: number;
    source: string;
    description?: string;
    status: "Pending" | "Completed" | "Failed";
    transactionTime: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  let wallets: Wallet[] = [];
  let transactions: Transaction[] = [];
  
  export const walletService = {
    async createWallet(userId: string) {
      const existingWallet = wallets.find((w) => w.userId === userId);
      if (existingWallet) throw new Error("Wallet already exists");
  
      const newWallet: Wallet = {
        walletId: crypto.randomUUID(),
        userId,
        balance: 0,
        currency: "INR",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      wallets.push(newWallet);
      return newWallet;
    },
  
    async getWallet(userId: string) {
      return wallets.find((w) => w.userId === userId);
    },
  
    async createTransaction(transactionData: {
      walletId: string;
      type: "Credit" | "Debit";
      amount: number;
      source: string;
      description?: string;
    }) {
      const wallet = wallets.find((w) => w.walletId === transactionData.walletId);
      if (!wallet) throw new Error("Wallet not found");
  
      const newTransaction: Transaction = {
        transactionId: crypto.randomUUID(),
        ...transactionData,
        status: "Pending",
        transactionTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      transactions.push(newTransaction);
      return newTransaction;
    },
  
    async getTransactions(walletId: string) {
      return transactions.filter((t) => t.walletId === walletId);
    },
  };
  