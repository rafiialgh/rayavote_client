'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LuArrowUpRight, LuMenu, LuX } from 'react-icons/lu';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'top-4' : 'top-0'}`}>
      <div className={`mx-auto transition-all duration-500 ${scrolled ? 'max-w-[90%] md:max-w-[1100px]' : 'max-w-full'}`}>
        <div className={`relative flex items-center justify-between px-6 py-4 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl' : 'bg-transparent'
        }`}>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-[#FF8D1D] rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-black font-bold text-xl">RV</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">RayaVote</span>
          </div>

          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            {['Home', 'About', 'Services'].map((item) => (
              <li key={item} className="hover:text-[#FF8D1D] cursor-pointer transition-colors">{item}</li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-white text-sm font-medium px-5 py-2 hover:opacity-70 transition-opacity">Login</button>
            <button className="bg-[#FF8D1D] hover:bg-[#ff9d3d] text-black font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#FF8D1D]/20">
              Get Started <LuArrowUpRight size={18} />
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white p-2">
            {isMenuOpen ? <LuX size={28} /> : <LuMenu size={28} />}
          </button>
        </div>

        <div className={`md:hidden absolute left-0 right-0 mt-2 transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <div className="bg-black/95 backdrop-blur-xl mx-4 rounded-2xl p-6 border border-white/10 shadow-2xl">
            <ul className="space-y-4 mb-6">
              {['Home', 'About', 'Services'].map((item) => (
                <li key={item} className="text-white text-lg font-medium border-b border-white/5 pb-2">{item}</li>
              ))}
            </ul>
            <button className="w-full bg-[#FF8D1D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2">
              Organization <LuArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};