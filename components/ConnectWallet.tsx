'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LuWallet, LuLoader, LuCheck, LuLogOut } from 'react-icons/lu';

export default function ConnectWalletButton() {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        setIsLoading(true);
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        setTimeout(() => {
            setAccount(accounts[0]);
            setIsLoading(false);
            toast.success("Wallet connected successfully!");
        }, 800);

      } catch (err: any) {
        setIsLoading(false);
        console.error("User rejected request", err);
        if (err.code === 4001) {
            toast.warning("Connection rejected by user.");
        } else {
            toast.error("Failed to connect wallet.");
        }
      }
    } else {
      toast.error("MetaMask is not installed. Please install it to continue.");
    }
  };

  const disconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAccount(null);
    toast.info("Wallet disconnected");
  };

  if (account) {
    return (
      <div className="group relative">
        <button 
            className="flex items-center w-full justify-center gap-3 bg-white border border-gray-200 text-black px-5 py-3 rounded-xl font-bold shadow-sm transition-all hover:shadow-md cursor-default"
        >
            <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse absolute -right-0.5 -top-0.5"></div>
                <LuWallet size={18} className="text-gray-500" />
            </div>
            <span className="font-mono text-sm tracking-wide">
                {account.substring(0, 6)}...{account.slice(-4)}
            </span>
            <LuCheck className="text-green-500 ml-1" size={16} />
        </button>
        
        <button 
            onClick={disconnect}
            className="absolute top-full left-0 w-full mt-2 bg-red-50 text-red-500 text-sm font-bold py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex items-center justify-center gap-2 border border-red-100 shadow-lg"
        >
            <LuLogOut size={14} /> Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className={`
        flex items-center w-full justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300
        ${isLoading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
            : 'bg-black text-white hover:bg-[#FF8D1D] hover:text-black hover:shadow-lg hover:shadow-[#FF8D1D]/20 active:scale-95'
        }
      `}
    >
      {isLoading ? (
        <>
          <LuLoader className="animate-spin" size={18} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <LuWallet size={18} />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
}