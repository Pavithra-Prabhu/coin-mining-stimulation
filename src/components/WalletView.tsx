import React, { useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import { Wallet, ChevronDown, Send, Clock, ArrowDownRight, ArrowUpRight, Copy, Check } from 'lucide-react';

const WalletView: React.FC = () => {
  const { wallet, sendTransaction } = useBlockchain();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransacting, setIsTransacting] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (!recipientAddress || !amount) {
      setError('Please fill in all fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountValue > wallet.balance) {
      setError('Insufficient funds');
      return;
    }

    try {
      setIsTransacting(true);
      setError(null);
      await sendTransaction(recipientAddress, amountValue);
      setRecipientAddress('');
      setAmount('');
      setIsTransacting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setIsTransacting(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format transaction amount with + or - sign
  const formatAmount = (transaction: { from: string; to: string; amount: number }) => {
    if (transaction.from === wallet.address) {
      return <span className="text-red-400">-{transaction.amount}</span>;
    } else {
      return <span className="text-green-400">+{transaction.amount}</span>;
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <Wallet className="mr-2" /> Your Wallet
      </h2>
      
      <div className="flex flex-col space-y-4">
        {/* Wallet Address & Balance */}
        <div className="p-3 bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Address</span>
            <button 
              onClick={copyAddress}
              className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
            >
              {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-sm truncate">{wallet.address}</div>
          
          <div className="mt-3">
            <span className="text-sm text-gray-400">Balance</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-white">{wallet.balance}</span>
              <span className="ml-1 text-gray-400">coins</span>
            </div>
          </div>
        </div>
        
        {/* Send Transaction */}
        <div className="p-3 bg-gray-700 rounded-lg">
          <h3 className="text-base font-semibold mb-2 flex items-center">
            <Send size={16} className="mr-1" /> Send Coins
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 font-mono text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Amount</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}
            
            <button
              onClick={handleSend}
              disabled={isTransacting}
              className={`w-full py-2 rounded-lg flex items-center justify-center ${
                isTransacting
                  ? 'bg-blue-800 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isTransacting ? 'Processing...' : 'Send Coins'}
            </button>
          </div>
        </div>
        
        {/* Transaction History */}
        <div className="p-3 bg-gray-700 rounded-lg">
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="w-full flex items-center justify-between text-base font-semibold"
          >
            <div className="flex items-center">
              <Clock size={16} className="mr-1" /> Transaction History
            </div>
            <ChevronDown
              size={20}
              className={`transition-transform duration-200 ${showTransactions ? 'transform rotate-180' : ''}`}
            />
          </button>
          
          {showTransactions && (
            <div className="mt-2 divide-y divide-gray-600 max-h-60 overflow-y-auto">
              {wallet.getTransactionHistory().length === 0 ? (
                <div className="py-3 text-sm text-gray-400 text-center">
                  No transactions yet
                </div>
              ) : (
                wallet.getTransactionHistory().map((tx) => (
                  <div key={tx.id} className="py-3">
                    <div className="flex items-center">
                      {tx.from === wallet.address ? (
                        <ArrowUpRight size={16} className="text-red-400 mr-2" />
                      ) : (
                        <ArrowDownRight size={16} className="text-green-400 mr-2" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-mono truncate w-32">
                            {tx.from === wallet.address ? 'To: ' + tx.to.substring(0, 10) + '...' : 'From: ' + tx.from.substring(0, 10) + '...'}
                          </span>
                          <span className="font-semibold">{formatAmount(tx)}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTimestamp(tx.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletView;