'use client';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft, LuMail, LuLock, LuLoader } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { setSignIn } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { getElectionFactContract } from '@/utils/contract';
import ConnectWalletButton from '@/components/ConnectWallet';

export default function Company() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    if (!email || !password) {
      toast.warning('Email and password are required');
      return;
    }

    setIsLoading(true);
    const data = { email, password };

    try {
      const response = await setSignIn(data);

      if (response.error) {
        toast.error(response.message);
        setIsLoading(false);
      } else {
        toast.success('Login successful!');
        const token = response.data.token;
        const tokenBase64 = btoa(token);

        Cookies.set('token', tokenBase64);
        Cookies.set('company_id', response.data.companyId);
        Cookies.set('company_email', response.data.companyEmail);

        try {
          const companyEmail = response.data.companyEmail;

          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const electionFact = getElectionFactContract();
          if (!electionFact) {
            toast.error('Blockchain contract not found.');
            setIsLoading(false);
            return;
          }

          console.log(electionFact);
          console.log(companyEmail);
          const summary = await electionFact.getDeployedElection(companyEmail);
          console.log(summary);
          
          if (summary[2] === 'Create an election.') {
            router.push(`/election/create_election`);
          } else {
            Cookies.set('address', summary[0]);
            router.push(`/dashboard`);
          }
        } catch (error) {
          console.error(error);
          toast.error('Blockchain verification failed.');
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during sign in.');
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full h-screen bg-white font-sans overflow-hidden'>
      <div className='hidden md:flex flex-[3] relative bg-black'>
        <img
          src='/img/login-banner.png'
          alt='banner'
          className='absolute inset-0 w-full h-full object-cover opacity-80'
        />
        <div className='relative z-10 flex flex-col justify-end p-16 text-white bg-gradient-to-t from-black/80 to-transparent w-full'>
          <h2 className='text-4xl font-bold mb-4'>Secure the Future of Voting</h2>
          <p className='text-gray-300 max-w-md'>
            Join hundreds of organizations using blockchain technology to ensure transparent and immutable election results.
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
          <div className='mb-10'>
            <div className='flex items-center gap-3 mb-2'>
               <h1 className='text-4xl md:text-5xl font-black tracking-tight text-gray-900'>
                Organization<br />Login
              </h1>
              <img src='/img/vector2.png' alt='' className='h-12 w-auto animate-pulse' />
            </div>
            <p className='text-gray-500 font-medium'>Welcome back! Please enter your details.</p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-gray-700 uppercase tracking-wider' htmlFor='email'>
                Email Address
              </label>
              <div className='relative'>
                <LuMail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  id='email'
                  type='email'
                  placeholder='name@company.com'
                  className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <label className='text-sm font-bold text-gray-700 uppercase tracking-wider' htmlFor='password'>
                  Password
                </label>
                <Link href="#" className='text-xs font-bold text-[#FF8D1D] hover:underline'>Forgot Password?</Link>
              </div>
              <div className='relative'>
                <LuLock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  className='w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onSubmit}
              disabled={isLoading}
              className='w-full bg-[#FF8D1D] hover:bg-[#ff9d3d] disabled:bg-gray-300 text-black font-extrabold py-4 rounded-xl shadow-lg shadow-[#FF8D1D]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <LuLoader className='animate-spin' /> Verifying Account...
                </>
              ) : (
                'Continue to Dashboard'
              )}
            </button>

            <ConnectWalletButton />

            <div className='text-center pt-4'>
              <p className='text-gray-600 text-sm'>
                Don't have an account?{' '}
                <Link href='/register/company'>
                  <span className='font-bold text-black hover:underline underline-offset-4 cursor-pointer'>
                    Register Organization
                  </span>
                </Link>
              </p>
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