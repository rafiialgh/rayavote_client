'use client';
import { setSignUp } from '@/services/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft, LuMail, LuLock, LuLoader, LuShieldPlus } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function RegisterCompany() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    if (!email || !password || !repeatPassword) {
      toast.warning('All fields are required!');
      return;
    } 
    
    if (password !== repeatPassword) {
      toast.warning('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await setSignUp({ email, password });
      if (response.error) {
        const errorMessage = response.message.split("email:")[1]?.trim() || response.message;
        toast.error(errorMessage);
        setIsLoading(false);
      } else {
        toast.success('Registration successful!');
        setTimeout(() => {
          router.push('/login/company');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className='flex w-full h-screen bg-white font-sans overflow-hidden text-[#222222]'>
      <div className='hidden md:flex flex-[3] relative bg-black'>
        <img
          src='/img/login-banner.png'
          alt='banner'
          className='absolute inset-0 w-full h-full object-cover opacity-80'
        />
        <div className='relative z-10 flex flex-col justify-end p-16 text-white bg-gradient-to-t from-black/80 to-transparent w-full'>
          <div className='bg-[#FF8D1D] w-fit p-2 rounded-lg mb-6 shadow-lg shadow-[#FF8D1D]/40'>
            <LuShieldPlus size={32} className='text-black' />
          </div>
          <h2 className='text-4xl font-bold mb-4'>Empower Your Democracy</h2>
          <p className='text-gray-300 max-w-md'>
            Start your journey toward transparent, secure, and tamper-proof voting today. Join the decentralized revolution.
          </p>
        </div>
      </div>

      <div className='flex-[2] flex flex-col h-full bg-white overflow-y-auto'>
        <div className='py-6 px-8 md:px-12'>
          <Link href='/'>
            <button className='group flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors'>
              <LuArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' />
              Back to Home
            </button>
          </Link>
        </div>

        <div className='flex-1 flex flex-col justify-center px-8 md:px-20 py-10'>
          <div className='mb-10'>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-4xl md:text-5xl font-black tracking-tight text-gray-900'>
                Create<br />Organization
              </h1>
              <img src='/img/vector2.png' alt='' className='h-12 w-auto' />
            </div>
            <p className='text-gray-500 font-medium'>Join us to start managing your digital elections.</p>
          </div>

          <div className='space-y-5'>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-gray-700 uppercase tracking-wider' htmlFor='email'>
                Email Address
              </label>
              <div className='relative group'>
                <LuMail size={20} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' />
                <input
                  id='email'
                  type='email'
                  placeholder='admin@organization.com'
                  className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-gray-700 uppercase tracking-wider' htmlFor='password'>
                Password
              </label>
              <div className='relative group'>
                <LuLock size={20} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' />
                <input
                  id='password'
                  type='password'
                  placeholder='Create a secure password'
                  className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-bold text-gray-700 uppercase tracking-wider' htmlFor='repeatPassword'>
                Confirm Password
              </label>
              <div className='relative group'>
                <LuLock size={20} className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' />
                <input
                  id='repeatPassword'
                  type='password'
                  placeholder='Repeat your password'
                  className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all'
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={onSubmit}
              disabled={isLoading}
              className='w-full bg-[#FF8D1D] hover:bg-[#ff9d3d] disabled:bg-gray-300 text-black font-extrabold py-4 rounded-xl shadow-lg shadow-[#FF8D1D]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4'
            >
              {isLoading ? (
                <>
                  <LuLoader className='animate-spin' /> Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className='text-center pt-2'>
              <p className='text-gray-600 text-sm'>
                Already have an account?{' '}
                <Link href='/login/company'>
                  <span className='font-bold text-black hover:underline underline-offset-4 cursor-pointer'>
                    Login here
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className='py-8 px-8 text-center md:text-left mt-auto'>
          <p className='text-[10px] text-gray-400 uppercase tracking-[0.2em]'>
            Secured by Ethereum Smart Contracts
          </p>
        </div>
      </div>
    </div>
  );
}