'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { setSignInVoter } from '@/services/voter';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Voter() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const onSubmit = async () => {
    const data = {
      email,
      password,
    };

    if (!data.email || !data.password) {
      toast.error('Email dan password harus diisi!');
    } else {
      try {
        const response = await setSignInVoter(data);
        console.log(response)

        if (response.error) {
          toast.error(response.message);
        } else {
          setIsLoading(true);
          toast.success('Login berhasil!');
          const token = response.data.tokenVoter;
          console.log(token);
          const tokenBase64 = btoa(token);

          const user = jwtDecode<JwtPayload>(atob(tokenBase64));
          Cookies.set('tokenVoter', tokenBase64)
          Cookies.set('address', response.data.voter.electionAddress)
          Cookies.set('emailVoter', response.data.voter.email)
          router.push('/voting')
        }
      } catch (error) {}
    }

    console.log(data);
  };

  return (
    <>
      <div className='flex w-full h-screen'>
        <div className='flex-[4] hidden md:block overflow-hidden'>
          <img
            src='/img/login-banner.png'
            alt='banner'
            className='object-cover h-screen object-right'
          />
        </div>
        <div className='flex-[2] bg-white'>
          <div className='mb-5 border-b py-5 px-10'>
            <Link href='/'>
              <p className='flex items-center text-xl'>
                <span className='mr-1'>
                  <LuArrowLeft />
                </span>
                Back
              </p>
            </Link>
          </div>

          <div className='p-10 flex flex-col'>
            <div className='flex items-center mb-10'>
              <h1 className='text-5xl mr-3'>
                Voter <br /> Login
              </h1>
              <img src='/img/vector2.png' alt='' className='h-[82px]' />
            </div>

            <div className='w-full h-fit bg-[#D9D9D9] p-3 rounded-lg'>
              <div className='w-full h-full bg-white rounded-sm px-5 py-10 flex flex-col'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='border border-black rounded-sm p-2 mb-5 font-sans'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  placeholder='Enter your password'
                  className='border border-black rounded-sm p-2 mb-5 font-sans'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <div className=''>
                  <button
                    type='button'
                    onClick={onSubmit}
                    className='bg-[#FF8D1D] w-full p-2 border border-black rounded-sm hover:bg-[#FF9E3D] transition'
                  >
                    Continue to sign in
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
