import React, { useEffect, useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { ArrowRight, Cpu, Server } from 'lucide-react';

const MiningVisualizer: React.FC = () => {
  const { miner, blockchain } = useBlockchain();
  const [hashAnimation, setHashAnimation] = useState<string[]>([]);
  const [blockFound, setBlockFound] = useState(false);

  // Generate random hash for visualization
  const generateRandomHash = () => {
    const characters = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Simulate difficulty by adding leading zeros based on current difficulty
    const difficulty = blockchain.difficulty;
    hash = '0'.repeat(Math.min(difficulty, 6)) + hash.slice(Math.min(difficulty, 6));
    
    return hash;
  };

  // Mining animation effect
  useEffect(() => {
    if (!miner || !miner.getMiningStats().isActive) {
      return;
    }

    const interval = setInterval(() => {
      const newHash = generateRandomHash();
      setHashAnimation(prev => {
        const updated = [...prev, newHash];
        // Keep only the last 5 hashes
        return updated.slice(Math.max(0, updated.length - 5));
      });
      
      // Occasionally simulate finding a block (1% chance)
      if (Math.random() < 0.01) {
        setBlockFound(true);
        setTimeout(() => setBlockFound(false), 2000);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [miner, blockchain.difficulty]);

  // Format hash for display
  const formatHashForDisplay = (hash: string) => {
    // Highlight leading zeros based on difficulty
    const leadingZeros = blockchain.difficulty;
    
    return (
      <span className="font-mono">
        <span className="text-green-400">{hash.substring(0, leadingZeros)}</span>
        <span className="text-gray-400">{hash.substring(leadingZeros, 10)}</span>
        <span className="text-gray-500">...</span>
      </span>
    );
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Cpu className="mr-2" /> Mining Visualization
      </h2>
      
      {!miner || !miner.getMiningStats().isActive ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
          <Server size={32} />
          <p className="mt-2">Mining is currently inactive</p>
          <p className="text-sm">Start mining to see the process in action</p>
        </div>
      ) : (
        <div className="relative">
          {/* Hash animation */}
          <div className="space-y-2">
            {hashAnimation.map((hash, index) => (
              <div 
                key={index} 
                className={`flex items-center transition-opacity duration-500 ${
                  index === hashAnimation.length - 1 ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="w-8 flex-shrink-0">
                  <span className="text-sm text-gray-500">
                    #{miner.getMiningStats().totalHashes - (hashAnimation.length - 1 - index)}
                  </span>
                </div>
                {formatHashForDisplay(hash)}
              </div>
            ))}
          </div>
          
          {/* Block found animation */}
          {blockFound && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 animate-pulse rounded-lg">
              <div className="text-center">
                <div className="text-green-400 text-2xl font-bold mb-2">BLOCK FOUND!</div>
                <div className="flex items-center justify-center text-sm">
                  <span className="text-yellow-400">+{blockchain.miningReward} coins</span>
                  <ArrowRight className="mx-2" size={16} />
                  <span>Your Wallet</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 border-t border-gray-700 pt-3 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>Target pattern:</span>
          <span className="font-mono">{"0".repeat(blockchain.difficulty)}...</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>Difficulty:</span>
          <span>{blockchain.difficulty}</span>
        </div>
      </div>
    </div>
  );
};

export default MiningVisualizer;