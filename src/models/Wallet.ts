import { Transaction, Wallet as WalletType } from '../types/blockchain';
import Blockchain from './Blockchain';
import { createTransaction, generateWalletAddress } from '../utils/crypto';

class Wallet implements WalletType {
  address: string;
  balance: number;
  transactions: Transaction[];
  private blockchain: Blockchain;

  constructor(blockchain: Blockchain, existingAddress?: string) {
    this.blockchain = blockchain;
    this.address = existingAddress || generateWalletAddress();
    this.balance = 0;
    this.transactions = [];
    this.updateBalance();
  }

  /**
   * Update wallet balance and transaction history from blockchain
   */
  updateBalance(): void {
    this.balance = this.blockchain.getBalanceOfAddress(this.address);
    this.transactions = this.blockchain.getTransactionsForAddress(this.address);
  }

  /**
   * Create and add a transaction to the blockchain
   */
  async sendTransaction(to: string, amount: number): Promise<Transaction> {
    if (amount <= 0) {
      throw new Error('Transaction amount must be positive');
    }

    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }

    const transaction = await createTransaction(this.address, to, amount);
    this.blockchain.addTransaction(transaction);
    
    // Update balance
    this.updateBalance();
    
    return transaction;
  }

  /**
   * Generate a new wallet address
   */
  static createNewWallet(blockchain: Blockchain): Wallet {
    return new Wallet(blockchain);
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(): Transaction[] {
    return [...this.transactions].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get incoming transactions
   */
  getIncomingTransactions(): Transaction[] {
    return this.transactions.filter(tx => tx.to === this.address);
  }

  /**
   * Get outgoing transactions
   */
  getOutgoingTransactions(): Transaction[] {
    return this.transactions.filter(tx => tx.from === this.address);
  }
}

export default Wallet;