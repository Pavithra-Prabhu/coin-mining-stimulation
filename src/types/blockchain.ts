// Core blockchain types
export type Difficulty = number;

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  signature?: string;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: Difficulty;
  miner: string;
}

export interface Blockchain {
  chain: Block[];
  pendingTransactions: Transaction[];
  difficulty: Difficulty;
  miningReward: number;
}

export interface Wallet {
  address: string;
  balance: number;
  transactions: Transaction[];
}

export interface MiningStats {
  hashrate: number;
  successfulBlocks: number;
  totalHashes: number;
  startTime: number | null;
  isActive: boolean;
}

export interface NetworkStats {
  totalBlocks: number;
  totalTransactions: number;
  averageBlockTime: number;
  currentDifficulty: Difficulty;
  hashRate: number;
}