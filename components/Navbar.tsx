'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '../public/img/logo.svg';
import { LuArrowUpRight, LuMenu, LuX } from 'react-icons/lu';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const threshold = 100;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > threshold) {
          if (currentScrollY > lastScrollY) {
            setIsVisible(false); // Hide navbar on scroll down
          } else if (isMenuOpen) {
            setIsVisible(true);
          } else {
            setIsVisible(true); // Show navbar on scroll up
          }
          setLastScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed w-full z-50 transition-transform duration-300 flex justify-center ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`w-[90%] top-0 bg-black h-20 mx-4 mt-4 md:m-10 items-center flex ${
          isMenuOpen ? 'rounded-t-lg' : 'rounded-lg'
        } `}
      >
        <div className='flex w-full mx-10 items-center justify-between'>
          {/* Logo */}
          <Image src={logo} width={40} height={50} alt='logo' />

          {/* Mobile Menu Toggle */}
          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-white p-2 focus:outline-none'
            >
              {isMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <ul className='flex gap-7 text-[#222222]'>
              <li className='py-1 px-7 rounded-lg bg-white '>Home</li>
              <li className='py-1 px-7 rounded-lg bg-white '>About</li>
              <li className='py-1 px-7 rounded-lg bg-white '>Services</li>
            </ul>
          </div>

          {/* Desktop CTA Buttons */}
          <div className='hidden md:block'>
            <ul className='flex gap-7 text-[#222222]'>
              <li className='py-1 px-4 rounded-lg bg-white flex items-center'>
                Voter{' '}
                <span className='ml-2'>
                  <LuArrowUpRight />
                </span>
              </li>
              <li className='py-1 px-4 rounded-lg bg-[#FF8D1D] text-[#222222] flex items-center'>
              Organization{' '}
                <span className='ml-2'>
                  <LuArrowUpRight />
                </span>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className='md:hidden absolute top-full left-0 w-[90%] bg-black rounded-b-lg mx-4 shadow-lg'>
              <div className='flex flex-col'>
                <ul className='text-white'>
                  <li className='py-3 border-b border-gray-700 mx-10'>Home</li>
                  <li className='py-3 border-b border-gray-700 mx-10'>About</li>
                  <li className='py-3 border-b border-gray-700 mx-10'>
                    Services
                  </li>
                </ul>
                <div className='flex flex-col gap-y-4 my-4 mx-10'>
                  <button className='py-2 px-4 rounded-lg bg-white text-black flex items-center justify-center'>
                    Voter{' '}
                    <span className='ml-2'>
                      <LuArrowUpRight />
                    </span>
                  </button>
                  <button className='py-2 px-4 rounded-lg bg-[#FF8D1D] flex items-center justify-center'>
                    Company{' '}
                    <span className='ml-2'>
                      <LuArrowUpRight />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
