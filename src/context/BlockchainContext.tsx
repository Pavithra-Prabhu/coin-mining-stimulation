import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Blockchain from '../models/Blockchain';
import Miner from '../models/Miner';
import Wallet from '../models/Wallet';
import { Block, NetworkStats, Transaction } from '../types/blockchain';

interface BlockchainContextType {
  blockchain: Blockchain;
  wallet: Wallet;
  miner: Miner;
  networkStats: NetworkStats;
  isLoading: boolean;
  selectedBlock: Block | null;
  setSelectedBlock: (block: Block | null) => void;
  refreshData: () => void;
  sendTransaction: (to: string, amount: number) => Promise<Transaction>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [blockchain] = useState<Blockchain>(() => new Blockchain());
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [miner, setMiner] = useState<Miner | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalBlocks: 1,
    totalTransactions: 0,
    averageBlockTime: 0,
    currentDifficulty: 4,
    hashRate: 0
  });

  // Initialize wallet and miner
  useEffect(() => {
    const newWallet = new Wallet(blockchain);
    
    const newMiner = new Miner(blockchain, newWallet.address, () => {
      refreshData();
    });
    
    setWallet(newWallet);
    setMiner(newMiner);
    setIsLoading(false);
  }, [blockchain]);

  // Calculate network statistics
  const calculateNetworkStats = (): NetworkStats => {
    const chain = blockchain.chain;
    
    // Total blocks
    const totalBlocks = chain.length;
    
    // Total transactions
    let totalTransactions = 0;
    chain.forEach(block => {
      totalTransactions += block.transactions.length;
    });
    
    // Average block time
    let totalBlockTime = 0;
    let blockTimeCount = 0;
    
    for (let i = 1; i < chain.length; i++) {
      const blockTime = chain[i].timestamp - chain[i-1].timestamp;
      totalBlockTime += blockTime;
      blockTimeCount++;
    }
    
    const averageBlockTime = blockTimeCount > 0 
      ? Math.round(totalBlockTime / blockTimeCount / 1000) 
      : 0;
    
    // Current difficulty
    const currentDifficulty = blockchain.difficulty;
    
    // Network hashrate (from miner stats)
    const hashRate = miner ? miner.getMiningStats().hashrate : 0;
    
    return {
      totalBlocks,
      totalTransactions,
      averageBlockTime,
      currentDifficulty,
      hashRate
    };
  };

  const refreshData = () => {
    if (wallet) {
      wallet.updateBalance();
    }
    
    setNetworkStats(calculateNetworkStats());
  };

  const sendTransaction = async (to: string, amount: number): Promise<Transaction> => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }
    
    const transaction = await wallet.sendTransaction(to, amount);
    refreshData();
    return transaction;
  };

  const value = {
    blockchain,
    wallet: wallet as Wallet,
    miner: miner as Miner,
    networkStats,
    isLoading,
    selectedBlock,
    setSelectedBlock,
    refreshData,
    sendTransaction
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};