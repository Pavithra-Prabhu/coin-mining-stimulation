import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';

interface TooltipData {
  id: string;
  title: string;
  content: string;
}

const tooltips: TooltipData[] = [
  {
    id: 'blockchain',
    title: 'What is a Blockchain?',
    content: 'A blockchain is a distributed digital ledger that records transactions across many computers. Each block contains a timestamp and a link to the previous block, forming a chain. This structure makes it difficult to alter data without changing all subsequent blocks and gaining network consensus.'
  },
  {
    id: 'mining',
    title: 'What is Mining?',
    content: 'Mining is the process of adding transaction records to the blockchain. Miners use computer power to solve complex mathematical problems. The first to solve it gets to add a new block to the chain and receives a reward in cryptocurrency. This "proof-of-work" system ensures the security and integrity of the blockchain.'
  },
  {
    id: 'hash',
    title: 'What is a Hash?',
    content: 'A hash is a fixed-length string of characters generated from input data of any size. Blockchains use hash functions (like SHA-256) to create unique digital fingerprints of blocks. Even a tiny change in the input data produces a completely different hash output, making tampering easy to detect.'
  },
  {
    id: 'difficulty',
    title: 'What is Mining Difficulty?',
    content: 'Mining difficulty determines how hard it is to find a valid hash for a new block. It typically requires the hash to have a specific number of leading zeros. The network adjusts difficulty based on total mining power to maintain a consistent block creation rate (e.g., ~10 minutes for Bitcoin).'
  },
  {
    id: 'wallet',
    title: 'What is a Cryptocurrency Wallet?',
    content: 'A cryptocurrency wallet is a digital tool that allows users to store and manage their crypto assets. It contains a pair of cryptographic keys: a public key (your address) that others can send funds to, and a private key that authorizes transactions. Never share your private key with anyone!'
  }
];

const EducationalTooltips: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [dismissedTooltips, setDismissedTooltips] = useState<string[]>([]);
  
  const openTooltip = (id: string) => {
    setActiveTooltip(id);
  };
  
  const closeTooltip = () => {
    setActiveTooltip(null);
  };
  
  const dismissTooltip = (id: string) => {
    setDismissedTooltips(prev => [...prev, id]);
    setActiveTooltip(null);
  };
  
  const visibleTooltips = tooltips.filter(t => !dismissedTooltips.includes(t.id));
  
  if (visibleTooltips.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-10">
      {/* Tooltip Pills */}
      <div className="flex flex-col space-y-2 items-end">
        {visibleTooltips.map(tooltip => (
          <button
            key={tooltip.id}
            onClick={() => openTooltip(tooltip.id)}
            className={`px-3 py-1 rounded-full flex items-center text-sm ${
              activeTooltip === tooltip.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <Lightbulb size={14} className="mr-1" />
            <span>{tooltip.title}</span>
          </button>
        ))}
      </div>
      
      {/* Active Tooltip */}
      {activeTooltip && (
        <div className="absolute bottom-12 right-0 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4 text-white">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-blue-400">
              {tooltips.find(t => t.id === activeTooltip)?.title}
            </h3>
            <button onClick={closeTooltip} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
          
          <p className="text-sm mb-3">
            {tooltips.find(t => t.id === activeTooltip)?.content}
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={() => dismissTooltip(activeTooltip)}
              className="text-xs text-gray-400 hover:text-gray-300"
            >
              Don't show again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalTooltips;