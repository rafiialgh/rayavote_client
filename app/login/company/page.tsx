'use client';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { setSignIn } from '@/services/auth';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { checkElection } from '@/services/election';
import { getElectionFactContract } from '@/utils/contract';

export default function Company() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    const data = {
      email,
      password,
    };

    if (!email || !password) {
      toast.warning('Email dan password harus diisi');
    } else {
      try {
        const response = await setSignIn(data);

        console.log(response);
        if (response.error) {
          toast.error(response.message);
        } else {
          // setIsLoading(true);
          toast.success('Login berhasil!');
          const token = response.data.token;
          console.log(token);
          const tokenBase64 = btoa(token);

          Cookies.set('token', tokenBase64);
          Cookies.set('company_id', response.data.companyId);
          Cookies.set('company_email', response.data.companyEmail);

          // const checkResponses = await checkElection(response.data.companyId);
          // console.log(checkResponses);

          // if (checkResponses && checkResponses.message === 'Election already exists') {
          //   router.push('/dashboard');
          // } else {
          //   router.push('/election/create_election');
          // }

          try {
            const email = response.data.companyEmail;
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const electionFact = getElectionFactContract();
            console.log(electionFact);
            if (!electionFact) {
              toast.error('Failed to get election contract.');
              return;
            }

            const summary = await electionFact.getDeployedElection(
              email
            );
            if (summary[2] == 'Create an election.') {
              console.log('belum ada election');
              router.push(`/election/create_election`);
            } else {
              Cookies.set('address', summary[0]);
              console.log('sudah ada election' + summary[0]);
              router.push(`/dashboard`);
            }
          } catch (error) {
            toast.error('Terjadi kesalahan saat check election');
          }
        }
      } catch (error) {
        console.error(error);
        toast.error('Terjadi kesalahan saat sign in.');
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded-md shadow-lg'>
            <p className='text-lg font-semibold'>Redirecting to dashboard...</p>
          </div>
        </div>
      )} */}

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
              Organization <br /> Login
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
                  className='border border-black rounded-sm p-2 mb-3 font-sans'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <div className='mb-3'>
                  <Link href='/register/company'>
                    <p className='underline text-blue-600'>Sign up</p>
                  </Link>
                </div>

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
