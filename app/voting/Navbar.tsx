'use client';
import React from 'react';
import logo from '@/public/img/logo.svg';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { LuLogOut, LuUser } from 'react-icons/lu';

function Navbar({ user }: { user: string }) {
  const router = useRouter();

  const logout = () => {
    Cookies.remove('address');
    Cookies.remove('emailVoter');
    Cookies.remove('tokenVoter');
    router.push('/login/voter');
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-[#FF8D1D] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-black font-bold text-xl">RV</span>
            </div>
            <span className="text-black font-bold text-xl tracking-tight">RayaVote</span>
          </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Logged in as</span>
             <span className="text-sm font-bold truncate max-w-[150px]">{user || 'Voter'}</span>
          </div>
          
          <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-black text-white hover:bg-[#FF8D1D] hover:text-black transition-colors px-5 py-2.5 rounded-xl font-bold text-sm"
          >
            <span>Logout</span>
            <LuLogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;