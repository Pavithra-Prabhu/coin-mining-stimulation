import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { 
  Play, 
  Square, 
  Settings, 
  CpuIcon, 
  Activity, 
  Clock, 
  Award, 
  HelpCircle
} from 'lucide-react';

const MiningControls: React.FC = () => {
  const { miner, networkStats, blockchain } = useBlockchain();
  const [hashPower, setHashPower] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const miningStats = miner ? miner.getMiningStats() : null;
  const isActive = miningStats ? miningStats.isActive : false;
  
  const handleStart = () => {
    if (miner && !isActive) {
      miner.startMining(hashPower);
    }
  };
  
  const handleStop = () => {
    if (miner && isActive) {
      miner.stopMining();
    }
  };
  
  const handleHashPowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setHashPower(value);
    
    if (miner && isActive) {
      miner.setHashPower(value);
    }
  };
  
  const formatHashRate = (rate: number): string => {
    if (rate < 1000) {
      return `${rate} H/s`;
    } else if (rate < 1000000) {
      return `${(rate / 1000).toFixed(2)} KH/s`;
    } else {
      return `${(rate / 1000000).toFixed(2)} MH/s`;
    }
  };
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <Settings className="mr-2" /> Mining Controls
      </h2>
      
      <div className="flex flex-col space-y-4">
        {/* Mining Power Slider */}
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="hashPower" className="block text-sm font-medium text-gray-300">
              Hash Power
            </label>
            <div 
              className="cursor-help relative"
              onMouseEnter={() => setShowTooltip('hashPower')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <HelpCircle size={16} className="text-gray-400" />
              
              {showTooltip === 'hashPower' && (
                <div className="absolute right-0 bottom-6 w-48 bg-black bg-opacity-90 p-2 rounded text-xs z-10">
                  Determines how many hashes per second your miner will attempt. Higher hash power means more chances to find a block but also more energy consumption.
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="range"
              id="hashPower"
              min="1"
              max="10"
              value={hashPower}
              onChange={handleHashPowerChange}
              className="w-full"
            />
            <span className="w-12 text-right">{hashPower}x</span>
          </div>
        </div>
        
        {/* Mining Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm mt-2">
          <div className="bg-gray-700 p-2 rounded flex flex-col">
            <span className="text-xs text-gray-400 flex items-center">
              <Activity size={12} className="mr-1" /> Hash Rate
            </span>
            <span className="font-mono">{formatHashRate(miningStats?.hashrate || 0)}</span>
          </div>
          
          <div className="bg-gray-700 p-2 rounded flex flex-col">
            <span className="text-xs text-gray-400 flex items-center">
              <Clock size={12} className="mr-1" /> Mining Time
            </span>
            <span>
              {miningStats?.startTime 
                ? Math.floor((Date.now() - miningStats.startTime) / 1000) + 's'
                : '0s'}
            </span>
          </div>
          
          <div className="bg-gray-700 p-2 rounded flex flex-col">
            <span className="text-xs text-gray-400 flex items-center">
              <CpuIcon size={12} className="mr-1" /> Network Difficulty
            </span>
            <span>{networkStats?.currentDifficulty || 0}</span>
          </div>
          
          <div className="bg-gray-700 p-2 rounded flex flex-col">
            <span className="text-xs text-gray-400 flex items-center">
              <Award size={12} className="mr-1" /> Blocks Mined
            </span>
            <span>{miningStats?.successfulBlocks || 0}</span>
          </div>
        </div>
        
        {/* Mining Actions */}
        <div className="flex space-x-3 mt-3">
          <button
            onClick={handleStart}
            disabled={isActive}
            className={`flex-1 py-2 flex items-center justify-center rounded-lg ${
              isActive 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Play size={18} className="mr-2" />
            Start Mining
          </button>
          
          <button
            onClick={handleStop}
            disabled={!isActive}
            className={`flex-1 py-2 flex items-center justify-center rounded-lg ${
              !isActive 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <Square size={18} className="mr-2" />
            Stop Mining
          </button>
        </div>
        
        {/* Mining Reward Info */}
        <div className="text-center text-sm text-gray-400 mt-2">
          <div className="flex items-center justify-center">
            <span>Current Block Reward:</span>
            <span className="ml-1 text-yellow-400 font-semibold">{blockchain.miningReward} coins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningControls;