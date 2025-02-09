'use client'
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';
import logo from '@/public/img/logo.svg';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [address, setAddress] = useState('');
  const router = useRouter();

  const threshold = 100;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const address = Cookies.get('address') || '';
    setAddress(address);

    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        if (currentScrollY > threshold) {
          if (currentScrollY > lastScrollY) {
            setIsVisible(false);
          } else if (isMenuOpen) {
            setIsVisible(true);
          } else {
            setIsVisible(true);
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

  const logout = () => {
    Cookies.remove('address');
    Cookies.remove('company_email');
    Cookies.remove('company_id');
    Cookies.remove('token');

    router.push('/login/company');
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-transform duration-300 flex justify-center ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div
          className={`w-full top-0 bg-black h-20 m-4 md:m-10 items-center flex ${
            isMenuOpen ? 'rounded-t-lg' : 'rounded-lg'
          } `}
        >
          <div className='flex w-full mx-10 items-center justify-between md:justify-normal'>
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
            <div className='hidden md:block mx-auto'>
              <ul className='flex gap-7 text-[#222222]'>
                <Link
                  href='/dashboard'
                  className='py-1 px-7 rounded-lg bg-white block'
                >
                  <li>Dashboard</li>
                </Link>
                <Link
                  href='/dashboard/candidate'
                  className='py-1 px-7 rounded-lg bg-white block'
                >
                  <li>Candidate</li>
                </Link>
                <Link
                  href='/dashboard/voter'
                  className='py-1 px-7 rounded-lg bg-white block'
                >
                  <li>Voter</li>
                </Link>
                <Link
                  href='/dashboard/election'
                  className='py-1 px-7 rounded-lg bg-white block'
                >
                  <li>Election</li>
                </Link>
              </ul>
            </div>

            {/* Display the address */}
            <h1 className='text-white font-sans text-sm'>{address}</h1>

            {/* Logout Button */}
            <button
              onClick={logout}
              className='text-white py-1 px-7 rounded-lg bg-red-600 ml-4'
            >
              Logout
            </button>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
              <div className='md:hidden absolute top-full left-0 w-full bg-black rounded-b-lg mx-4 shadow-lg'>
                <div className='flex flex-col'>
                  <ul className='text-white'>
                    <li className='py-3 border-b border-gray-700 mx-10'>
                      Home
                    </li>
                    <li className='py-3 border-b border-gray-700 mx-10'>
                      About
                    </li>
                    <li className='py-3 border-b border-gray-700 mx-10'>
                      Services
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
