import { 
  Block, 
  Blockchain as BlockchainType,
  Difficulty, 
  Transaction 
} from '../types/blockchain';
import { calculateBlockHash, hashMeetsDifficulty, mineBlock } from '../utils/crypto';

class Blockchain implements BlockchainType {
  chain: Block[];
  pendingTransactions: Transaction[];
  difficulty: Difficulty;
  miningReward: number;
  
  constructor() {
    // Create the genesis block
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = 4; // Starting difficulty
    this.miningReward = 50; // Mining reward in tokens
  }
  
  /**
   * Create the first block in the chain
   */
  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0'.repeat(64),
      hash: '0'.repeat(64),
      nonce: 0,
      difficulty: 0,
      miner: 'Genesis'
    };
  }
  
  /**
   * Get the latest block in the chain
   */
  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }
  
  /**
   * Add transaction to pending transactions pool
   */
  addTransaction(transaction: Transaction): void {
    // Verify transaction (simplified for simulation)
    if (!transaction.from || !transaction.to) {
      throw new Error('Transaction must include from and to addresses');
    }
    
    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be positive');
    }
    
    // For non-reward transactions, verify sender has sufficient balance
    if (transaction.from !== '0x0000000000000000000000000000000000000000') {
      const senderBalance = this.getBalanceOfAddress(transaction.from);
      if (senderBalance < transaction.amount) {
        throw new Error('Insufficient balance');
      }
    }
    
    this.pendingTransactions.push(transaction);
  }
  
  /**
   * Start mining process for pending transactions
   */
  async minePendingTransactions(
    minerAddress: string,
    onHashCalculated?: (hash: string, nonce: number) => void
  ): Promise<Block> {
    // Create a mining reward transaction
    const rewardTx: Transaction = {
      id: `reward_${Date.now()}`,
      from: '0x0000000000000000000000000000000000000000', // System address
      to: minerAddress,
      amount: this.miningReward,
      timestamp: Date.now()
    };
    
    // Add mining reward and create a new block
    const transactions = [...this.pendingTransactions, rewardTx];
    const latestBlock = this.getLatestBlock();
    
    const newBlock: Omit<Block, 'hash' | 'nonce'> = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions,
      previousHash: latestBlock.hash,
      difficulty: this.difficulty,
      miner: minerAddress
    };
    
    // Mine the block
    const { hash, nonce } = await mineBlock(newBlock, this.difficulty, onHashCalculated);
    
    // Create the complete block with the hash and nonce
    const minedBlock: Block = {
      ...newBlock,
      hash,
      nonce
    };
    
    // Add the mined block to the chain
    this.chain.push(minedBlock);
    
    // Clear pending transactions
    this.pendingTransactions = [];
    
    // Adjust difficulty
    this.adjustDifficulty();
    
    return minedBlock;
  }
  
  /**
   * Validate the entire blockchain
   */
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Verify block hash
      const promise = calculateBlockHash(
        currentBlock.index,
        previousBlock.hash,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.nonce,
        currentBlock.difficulty
      );
      
      promise.then(calculatedHash => {
        if (currentBlock.hash !== calculatedHash) {
          return false;
        }
      });
      
      // Verify previous hash reference
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
      
      // Verify hash meets difficulty
      if (!hashMeetsDifficulty(currentBlock.hash, currentBlock.difficulty)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Adjust mining difficulty based on mining speed
   */
  private adjustDifficulty(): void {
    const lastBlock = this.getLatestBlock();
    const previousBlock = this.chain[this.chain.length - 2];
    
    // Target block time is 2 minutes (120000 ms)
    const targetBlockTime = 120000;
    const actualBlockTime = lastBlock.timestamp - previousBlock.timestamp;
    
    // Adjust difficulty to maintain target block time
    if (actualBlockTime < targetBlockTime / 2) {
      this.difficulty += 1; // Mining was too fast, increase difficulty
    } else if (actualBlockTime > targetBlockTime * 2) {
      this.difficulty = Math.max(1, this.difficulty - 1); // Mining was too slow, decrease difficulty
    }
  }
  
  /**
   * Get balance for a wallet address
   */
  getBalanceOfAddress(address: string): number {
    let balance = 0;
    
    // Check each block in the chain
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address) {
          balance -= transaction.amount;
        }
        
        if (transaction.to === address) {
          balance += transaction.amount;
        }
      }
    }
    
    // Also check pending transactions
    for (const transaction of this.pendingTransactions) {
      if (transaction.from === address) {
        balance -= transaction.amount;
      }
      if (transaction.to === address) {
        balance += transaction.amount;
      }
    }
    
    return balance;
  }
  
  /**
   * Get transactions for a specific address
   */
  getTransactionsForAddress(address: string): Transaction[] {
    const transactions: Transaction[] = [];
    
    // Get transactions from blocks
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address || transaction.to === address) {
          transactions.push(transaction);
        }
      }
    }
    
    // Add pending transactions
    for (const transaction of this.pendingTransactions) {
      if (transaction.from === address || transaction.to === address) {
        transactions.push(transaction);
      }
    }
    
    return transactions;
  }
}

export default Blockchain;