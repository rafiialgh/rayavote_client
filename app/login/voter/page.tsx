'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft, LuTicket, LuLoader, LuShieldCheck } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { setSignInVoter } from '@/services/voter';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import ConnectWalletButton from '@/components/ConnectWallet';

export default function Voter() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    if (!token) {
      toast.warning('Please enter your unique access token');
      return;
    }

    setIsLoading(true);
    try {
      const response = await setSignInVoter({ token });

      if (response.error) {
        toast.error(response.message);
        setIsLoading(false);
      } else {
        toast.success('Access granted! Redirecting...');
        const tokenVoter = response.data.tokenVoter;
        const tokenBase64 = btoa(tokenVoter);

        Cookies.set('tokenVoter', tokenBase64);
        Cookies.set('address', response.data.voter.electionAddress);
        Cookies.set('emailVoter', response.data.voter.email);
        
        router.push('/voting');
      }
    } catch (error) {
      toast.error('Authentication failed. Check your token.');
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full h-screen bg-white font-sans overflow-hidden text-[#222222]'>
      <div className='hidden md:flex flex-[3] relative bg-[#FF8D1D]'>
        <Image
          src='/img/login-banner.png'
          alt='banner'
          width={1000}
          height={1000}
          className='absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-60'
        />
        <div className='relative z-10 flex flex-col justify-center p-20 text-white'>
          <div className='bg-white/20 backdrop-blur-md w-fit p-3 rounded-2xl mb-6'>
            <LuShieldCheck size={40} />
          </div>
          <h2 className='text-6xl font-black mb-6 leading-tight'>
            Your Privacy <br />is Our Priority.
          </h2>
          <p className='text-xl text-white/90 max-w-md leading-relaxed'>
            We use end-to-end encryption to ensure your vote is anonymous, 
            secure, and impossible to tamper with.
          </p>
        </div>
      </div>

      <div className='flex-[2] flex flex-col h-full'>
        <div className='py-6 px-8 md:px-12'>
          <Link href='/'>
            <button className='group flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors'>
              <LuArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' />
              Back to Home
            </button>
          </Link>
        </div>

        <div className='flex-1 flex flex-col justify-center px-8 md:px-20'>
          <div className='mb-12'>
            <div className='flex items-end gap-3 mb-4'>
              <h1 className='text-5xl font-black tracking-tighter text-gray-900'>
                Voter<br />Access
              </h1>
              <div className='h-3 w-3 bg-[#FF8D1D] rounded-full mb-3 animate-bounce'></div>
            </div>
            <p className='text-gray-500 font-medium'>
              Please enter the unique access token provided by your organization.
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-3'>
              <label className='text-sm font-bold text-gray-700 uppercase tracking-wider' htmlFor='token'>
                Access Token
              </label>
              <div className='relative group'>
                <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors'>
                  <LuTicket size={24} />
                </div>
                <input
                  id='token'
                  type='text'
                  placeholder='EX: VOTE-XXXX-XXXX'
                  className='w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#FF8D1D] outline-none transition-all font-mono text-lg tracking-wider'
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onSubmit}
              disabled={isLoading}
              className='w-full bg-black hover:bg-gray-900 disabled:bg-gray-200 text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden group'
            >
              {isLoading ? (
                <LuLoader className='animate-spin' size={24} />
              ) : (
                <>
                  <span>Enter Voting Room</span>
                  <div className='w-6 h-6 bg-[#FF8D1D] rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform'>
                    <LuArrowLeft size={14} className='rotate-180 text-black' />
                  </div>
                </>
              )}
            </button>

            <ConnectWalletButton />

            <div className='mt-8 p-5 bg-gray-50 border border-gray-100 rounded-2xl'>
              <div className='flex gap-3'>
                <LuShieldCheck className='text-[#FF8D1D] shrink-0' size={20} />
                <p className='text-xs text-gray-600 leading-relaxed'>
                  <strong>Privacy Note:</strong> Your token is a unique identifier. Once used, it cannot be reused. Keep it confidential to ensure your vote remains secure.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='py-8 px-8 text-center md:text-left'>
          <p className='text-[10px] text-gray-400 uppercase tracking-[0.2em]'>
            Secured by Ethereum Smart Contracts
          </p>
        </div>
      </div>
    </div>
  );
}