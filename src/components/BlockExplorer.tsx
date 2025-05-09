import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Database, ChevronDown, ChevronRight, Clock, User, Hash, Box } from 'lucide-react';
import { Block, Transaction } from '../types/blockchain';

const BlockExplorer: React.FC = () => {
  const { blockchain, selectedBlock, setSelectedBlock } = useBlockchain();
  const [expandedBlocks, setExpandedBlocks] = useState<{ [key: string]: boolean }>({});
  
  const toggleBlockExpand = (blockHash: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockHash]: !prev[blockHash]
    }));
  };
  
  const selectBlock = (block: Block) => {
    setSelectedBlock(block === selectedBlock ? null : block);
  };
  
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const shortenHash = (hash: string): string => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white h-full flex flex-col">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <Database className="mr-2" /> Block Explorer
      </h2>
      
      {selectedBlock ? (
        <div className="flex-1 overflow-y-auto">
          {/* Block Detail View */}
          <div className="mb-3 flex items-center">
            <button 
              onClick={() => setSelectedBlock(null)}
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <ChevronLeft size={20} className="mr-1" /> Back to Chain
            </button>
          </div>
          
          <div className="p-3 bg-gray-700 rounded-lg mb-3">
            <h3 className="text-lg font-semibold mb-2">Block #{selectedBlock.index}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-gray-400 w-24 flex-shrink-0">Hash:</span>
                <span className="font-mono break-all">{selectedBlock.hash}</span>
              </div>
              
              <div className="flex items-start">
                <span className="text-gray-400 w-24 flex-shrink-0">Prev Hash:</span>
                <span className="font-mono break-all">{selectedBlock.previousHash}</span>
              </div>
              
              <div className="flex items-start">
                <span className="text-gray-400 w-24 flex-shrink-0">Time:</span>
                <span>{formatTimestamp(selectedBlock.timestamp)}</span>
              </div>
              
              <div className="flex items-start">
                <span className="text-gray-400 w-24 flex-shrink-0">Nonce:</span>
                <span>{selectedBlock.nonce}</span>
              </div>
              
              <div className="flex items-start">
                <span className="text-gray-400 w-24 flex-shrink-0">Difficulty:</span>
                <span>{selectedBlock.difficulty}</span>
              </div>
              
              <div className="flex items-start">
                <span className="text-gray-400 w-24 flex-shrink-0">Miner:</span>
                <span className="font-mono">{shortenHash(selectedBlock.miner)}</span>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Transactions ({selectedBlock.transactions.length})</h3>
          
          {selectedBlock.transactions.length === 0 ? (
            <div className="p-3 bg-gray-700 rounded-lg text-gray-400 text-center">
              No transactions in this block
            </div>
          ) : (
            <div className="space-y-2">
              {selectedBlock.transactions.map((tx) => (
                <div key={tx.id} className="p-3 bg-gray-700 rounded-lg">
                  <div className="text-xs font-mono text-gray-400 mb-2">
                    ID: {tx.id}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">From:</span>
                      <div className="font-mono truncate" title={tx.from}>
                        {shortenHash(tx.from)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">To:</span>
                      <div className="font-mono truncate" title={tx.to}>
                        {shortenHash(tx.to)}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <div>{tx.amount}</div>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <div>{new Date(tx.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Blockchain List View */}
          <div className="space-y-2">
            {blockchain.chain.slice().reverse().map((block) => (
              <div key={block.hash} className="p-3 bg-gray-700 rounded-lg">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleBlockExpand(block.hash)}
                >
                  <div className="flex items-center">
                    <Box size={16} className="mr-2 text-blue-400" />
                    <span className="font-semibold">Block #{block.index}</span>
                    <span className="ml-2 text-sm text-gray-400">
                      ({block.transactions.length} transactions)
                    </span>
                  </div>
                  {expandedBlocks[block.hash] ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </div>
                
                {expandedBlocks[block.hash] && (
                  <div className="mt-2 pt-2 border-t border-gray-600 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Hash size={14} className="mr-1 text-gray-400" />
                        <span className="text-gray-400 mr-1">Hash:</span>
                        <span className="font-mono truncate">{shortenHash(block.hash)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <User size={14} className="mr-1 text-gray-400" />
                        <span className="text-gray-400 mr-1">Miner:</span>
                        <span className="font-mono truncate">{shortenHash(block.miner)}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        <span className="text-gray-400 mr-1">Time:</span>
                        <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-gray-400 mr-1">Difficulty:</span>
                        <span>{block.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          selectBlock(block);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {blockchain.chain.length === 0 && (
            <div className="p-3 bg-gray-700 rounded-lg text-gray-400 text-center">
              No blocks in the chain yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Create a ChevronLeft component since it's not imported at the top
const ChevronLeft: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export default BlockExplorer;