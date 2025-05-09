import React from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import MiningControls from '../components/MiningControls';
import MiningVisualizer from '../components/MiningVisualizer';
import WalletView from '../components/WalletView';
import NetworkStats from '../components/NetworkStats';
import BlockExplorer from '../components/BlockExplorer';
import EducationalTooltips from '../components/EducationalTooltips';
import { Loader } from 'lucide-react';

const DashboardView: React.FC = () => {
  const { isLoading } = useBlockchain();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 mx-auto text-blue-500" />
          <p className="mt-4 text-xl">Initializing Blockchain...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MiningVisualizer />
          <MiningControls />
        </div>
        
        {/* Block Explorer */}
        <BlockExplorer />
      </div>
      
      <div className="space-y-6">
        {/* Wallet and Network Stats */}
        <WalletView />
        <NetworkStats />
      </div>
      
      {/* Educational Tooltips */}
      <EducationalTooltips />
    </div>
  );
};

export default DashboardView;