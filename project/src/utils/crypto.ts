// Utility functions for cryptographic operations
import { v4 as uuidv4 } from 'uuid';
import { Block, Transaction } from '../types/blockchain';

/**
 * Calculate SHA-256 hash (simulated for browser environment)
 */
export const calculateHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  
  // Convert hash to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Calculate hash for a block
 */
export const calculateBlockHash = async (
  index: number,
  previousHash: string,
  timestamp: number,
  transactions: Transaction[],
  nonce: number,
  difficulty: number
): Promise<string> => {
  const dataString = index + previousHash + timestamp + JSON.stringify(transactions) + nonce + difficulty;
  return calculateHash(dataString);
};

/**
 * Generate a new wallet address
 */
export const generateWalletAddress = (): string => {
  return `0x${uuidv4().replace(/-/g, '')}`;
};

/**
 * Calculate transaction hash
 */
export const calculateTransactionHash = async (transaction: Omit<Transaction, 'id'>): Promise<string> => {
  const dataString = 
    transaction.from + 
    transaction.to + 
    transaction.amount + 
    transaction.timestamp;
  
  return calculateHash(dataString);
};

/**
 * Create a new signed transaction
 */
export const createTransaction = async (
  from: string,
  to: string,
  amount: number
): Promise<Transaction> => {
  const timestamp = Date.now();
  const transactionData = { from, to, amount, timestamp };
  const id = await calculateTransactionHash(transactionData);
  
  return {
    ...transactionData,
    id,
    signature: `sig_${id.substring(0, 8)}`
  };
};

/**
 * Verify if hash meets difficulty requirement (has leading zeros)
 */
export const hashMeetsDifficulty = (hash: string, difficulty: number): boolean => {
  const requiredPrefix = '0'.repeat(difficulty);
  return hash.startsWith(requiredPrefix);
};

/**
 * Simulate proof of work mining
 */
export const mineBlock = async (
  block: Omit<Block, 'hash' | 'nonce'>,
  difficulty: number,
  onHashCalculated?: (hash: string, nonce: number) => void
): Promise<{ hash: string; nonce: number }> => {
  let nonce = 0;
  let hash = '';
  
  while (true) {
    hash = await calculateBlockHash(
      block.index,
      block.previousHash,
      block.timestamp,
      block.transactions,
      nonce,
      difficulty
    );
    
    if (onHashCalculated) {
      onHashCalculated(hash, nonce);
    }
    
    if (hashMeetsDifficulty(hash, difficulty)) {
      break;
    }
    
    nonce++;
  }
  
  return { hash, nonce };
};