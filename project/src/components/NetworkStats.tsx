import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { BarChart, PieChart, Activity, Clock, Database, Cpu } from 'lucide-react';

const NetworkStats: React.FC = () => {
  const { networkStats, blockchain } = useBlockchain();
  
  const formatHashRate = (rate: number): string => {
    if (rate < 1000) {
      return `${rate} H/s`;
    } else if (rate < 1000000) {
      return `${(rate / 1000).toFixed(2)} KH/s`;
    } else {
      return `${(rate / 1000000).toFixed(2)} MH/s`;
    }
  };
  
  // Calculate estimated energy consumption (just for visualization)
  const calculateEnergy = (hashrate: number): string => {
    // Very simplified estimation: 1 KH/s ≈ 0.1 Watts
    const watts = (hashrate / 1000) * 0.1;
    if (watts < 1) {
      return `${(watts * 1000).toFixed(2)} mW`;
    } else if (watts < 1000) {
      return `${watts.toFixed(2)} W`;
    } else {
      return `${(watts / 1000).toFixed(2)} kW`;
    }
  };
  
  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <Activity className="mr-2" /> Network Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-700 rounded-lg flex flex-col">
          <span className="text-sm text-gray-400 flex items-center">
            <Database size={14} className="mr-1" /> Total Blocks
          </span>
          <span className="text-xl font-bold">{networkStats.totalBlocks}</span>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg flex flex-col">
          <span className="text-sm text-gray-400 flex items-center">
            <BarChart size={14} className="mr-1" /> Transactions
          </span>
          <span className="text-xl font-bold">{networkStats.totalTransactions}</span>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg flex flex-col">
          <span className="text-sm text-gray-400 flex items-center">
            <Clock size={14} className="mr-1" /> Avg Block Time
          </span>
          <span className="text-xl font-bold">{networkStats.averageBlockTime || '~'} sec</span>
        </div>
        
        <div className="p-3 bg-gray-700 rounded-lg flex flex-col">
          <span className="text-sm text-gray-400 flex items-center">
            <Cpu size={14} className="mr-1" /> Difficulty
          </span>
          <span className="text-xl font-bold">{networkStats.currentDifficulty}</span>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold flex items-center mb-3">
          <PieChart size={14} className="mr-1" /> Network Metrics
        </h3>
        
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Hashrate</span>
              <span>{formatHashRate(networkStats.hashRate)}</span>
            </div>
            <div className="w-full bg-gray-600 h-2 rounded-full mt-1">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((networkStats.hashRate / 10000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Est. Energy Consumption</span>
              <span>{calculateEnergy(networkStats.hashRate)}</span>
            </div>
            <div className="w-full bg-gray-600 h-2 rounded-full mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min((networkStats.hashRate / 15000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Mining Reward</span>
              <span>{blockchain.miningReward} coins</span>
            </div>
            <div className="w-full bg-gray-600 h-2 rounded-full mt-1">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-gray-700 rounded-lg text-sm text-center text-gray-400">
        Next difficulty adjustment in ~{120 - (networkStats.totalBlocks % 120)} blocks
      </div>
    </div>
  );
};

export default NetworkStats;