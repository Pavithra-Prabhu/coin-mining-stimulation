import { MiningStats } from '../types/blockchain';
import Blockchain from './Blockchain';

class Miner {
  private blockchain: Blockchain;
  private walletAddress: string;
  private miningStats: MiningStats;
  private miningInterval: NodeJS.Timeout | null = null;
  private updateCallback: () => void;
  private hashesPerTick = 1; // Simulated hashes processed per mining tick

  constructor(blockchain: Blockchain, walletAddress: string, updateCallback: () => void) {
    this.blockchain = blockchain;
    this.walletAddress = walletAddress;
    this.updateCallback = updateCallback;
    this.miningStats = {
      hashrate: 0,
      successfulBlocks: 0,
      totalHashes: 0,
      startTime: null,
      isActive: false
    };
  }

  /**
   * Start the mining process
   */
  startMining(hashPower: number = 1): void {
    if (this.miningStats.isActive) {
      return;
    }

    // Set hashrate based on hash power
    this.hashesPerTick = Math.floor(hashPower * 5);
    
    this.miningStats.isActive = true;
    this.miningStats.startTime = Date.now();
    this.updateCallback();

    // Start the mining simulation
    this.miningInterval = setInterval(() => this.miningTick(), 1000);
  }

  /**
   * Stop the mining process
   */
  stopMining(): void {
    if (!this.miningStats.isActive) {
      return;
    }

    if (this.miningInterval) {
      clearInterval(this.miningInterval);
      this.miningInterval = null;
    }

    this.miningStats.isActive = false;
    this.miningStats.startTime = null;
    this.updateCallback();
  }

  /**
   * Process a mining tick (called every second)
   */
  private async miningTick(): Promise<void> {
    // Simulate processing multiple hashes per second
    this.miningStats.totalHashes += this.hashesPerTick;
    
    // Calculate current hashrate
    const elapsedTimeInSeconds = 
      (Date.now() - (this.miningStats.startTime || Date.now())) / 1000;
    this.miningStats.hashrate = Math.floor(this.miningStats.totalHashes / Math.max(1, elapsedTimeInSeconds));
    
    // Simulate random success based on difficulty
    // Lower difficulty = higher chance of success
    const successProbability = Math.max(0.01, 0.5 / Math.pow(2, this.blockchain.difficulty));
    const isSuccessful = Math.random() < successProbability;
    
    if (isSuccessful) {
      try {
        await this.blockchain.minePendingTransactions(
          this.walletAddress,
          (hash, nonce) => {
            console.log(`Mining attempt: Hash ${hash.substring(0, 10)}... Nonce: ${nonce}`);
          }
        );
        
        this.miningStats.successfulBlocks++;
        this.updateCallback(); // Trigger update immediately after successful mining
      } catch (error) {
        console.error('Mining failed:', error);
      }
    }
  }

  /**
   * Get current mining stats
   */
  getMiningStats(): MiningStats {
    return {...this.miningStats};
  }

  /**
   * Set hash power (difficulty multiplier)
   */
  setHashPower(hashPower: number): void {
    this.hashesPerTick = Math.floor(hashPower * 5);
    this.updateCallback();
  }
}

export default Miner;