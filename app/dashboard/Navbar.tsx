'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  LuMenu,
  LuX,
  LuLayoutDashboard,
  LuUsers,
  LuVote,
  LuLogOut,
  LuFileText
} from 'react-icons/lu';
import logo from '@/public/img/logo.svg';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const addr = Cookies.get('address') || '';
    setAddress(addr);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    ['address', 'company_email', 'company_id', 'token'].forEach((c) => Cookies.remove(c));
    router.push('/login/company');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: <LuLayoutDashboard size={18} /> },
    { name: 'Candidates', href: '/dashboard/candidate', icon: <LuUsers size={18} /> },
    { name: 'Voters', href: '/dashboard/voter', icon: <LuVote size={18} /> },
    { name: 'Election', href: '/dashboard/election', icon: <LuFileText size={18} /> },
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled
        ? 'bg-white/80 backdrop-blur-md border-b border-gray-200'
        : 'bg-white border-b border-transparent'
      }`}>
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">

        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-[#FF8D1D] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-black font-bold text-xl">RV</span>
          </div>
          <span className="font-black text-xl tracking-tighter text-gray-900 hidden md:block">
            RayaVote <span className="text-[#FF8D1D]">Admin</span>
          </span>
        </div>

        <div className="hidden md:flex items-center bg-gray-100/50 p-1.5 rounded-xl border border-gray-100">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive
                    ? 'bg-white text-[#FF8D1D] shadow-sm ring-1 ring-gray-100'
                    : 'text-gray-500 hover:text-black hover:bg-gray-200/50'
                  }`}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {address && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-gray-600 font-bold tracking-wide">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors font-bold text-sm"
          >
            <LuLogOut size={16} />
            Logout
          </button>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-900 p-2">
          {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                <div className={`flex items-center gap-3 p-4 rounded-xl font-bold ${pathname === item.href ? 'bg-[#FF8D1D]/10 text-[#FF8D1D]' : 'text-gray-600'
                  }`}>
                  {item.icon} {item.name}
                </div>
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            <button onClick={logout} className="flex items-center gap-3 p-4 text-red-500 font-bold w-full text-left">
              <LuLogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;