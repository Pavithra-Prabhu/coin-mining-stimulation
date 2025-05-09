import React from 'react';
import { BlockchainProvider } from './context/BlockchainContext';
import DashboardView from './views/DashboardView';
import { Coins } from 'lucide-react';

function App() {
  return (
    <BlockchainProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="text-yellow-500 mr-2" size={28} />
              <h1 className="text-xl font-bold">BlockSim</h1>
              <span className="ml-2 bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded">
                Simulator
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Educational Blockchain Mining Simulator
            </div>
          </div>
        </header>

        <main className="container mx-auto py-6 px-4">
          <DashboardView />
        </main>
        
        <footer className="bg-gray-800 border-t border-gray-700 p-4 mt-8">
          <div className="container mx-auto text-center text-sm text-gray-400">
            <p>BlockSim - Educational Cryptocurrency Mining Simulator</p>
            <p className="mt-1">
              This is a simulation for educational purposes only. No real cryptocurrency is being mined.
            </p>
          </div>
        </footer>
      </div>
    </BlockchainProvider>
  );
}

export default App;