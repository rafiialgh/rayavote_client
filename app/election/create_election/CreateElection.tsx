'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import {
  LuArrowLeft,
  LuPenTool,
  LuFileText,
  LuCalendarClock,
  LuRocket,
  LuLoader
} from 'react-icons/lu';
import { toast } from 'react-toastify';
import { setElection } from '@/services/election';
import { useRouter } from 'next/navigation';
import { getElectionFactContract } from '@/utils/contract';
import Cookies from 'js-cookie';

export default function CreateElection() {
  const [electionName, setElectionName] = useState('');
  const [electionDesc, setElectionDesc] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async () => {
    const data = {
      electionName,
      electionDesc,
    };

    if (!data.electionName || !data.electionDesc || !startTime || !endTime) {
      toast.error('Semua field harus diisi!');
      return;
    }
    // else {
    //   const response = await setElection(data);
    //   console.log(response);
    //   toast.success(response.message);
    //   router.push(`/dashboard`);
    //   console.log(data);
    // }

    try {
      setIsLoading(true);
      const email = Cookies.get('company_email');
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const electionFact = getElectionFactContract();
      console.log(electionFact);
      if (!electionFact) {
        toast.error('Failed to get election contract.');
        return;
      }

      const tx = await electionFact.createElection(
        email,
        electionName,
        electionDesc
      );

      console.log(`Loading - ${tx.hash}`);
      await tx.wait();

      if (tx) {
        const [deployedAddress, elName, elDesc] =
          await electionFact.getDeployedElection(email);
        Cookies.set('address', deployedAddress);
        console.log(deployedAddress);
        console.log(elName);
        console.log(elDesc);

        // const localStartTime = new Date(startTime);
        // const utcStartTime = new Date(
        //   localStartTime.getTime() - localStartTime.getTimezoneOffset() * 60000
        // );
        // const isoStartTime = utcStartTime.toISOString();

        // const localEndTime = new Date(endTime);
        // const utcEndTime = new Date(
        //   localEndTime.getTime() - localEndTime.getTimezoneOffset() * 60000
        // );
        // const isoEndTime = utcEndTime.toISOString();

        if (!startTime || !endTime) {
          toast.error('Start time and end time cannot be empty.');
          return;
        }

        const localStartTime = new Date(startTime);
        const localEndTime = new Date(endTime);

        console.log(localStartTime);
        console.log(localEndTime);

        const isoStartTime = new Date(localStartTime.toISOString());
        const isoEndTime = new Date(localEndTime.toISOString());

        const response = await setElection({
          electionAddress: deployedAddress,
          startTime: isoStartTime.toISOString(),
          endTime: isoEndTime.toISOString(),
        });
      }

      console.log(`Success - ${tx.hash}`);
      toast.success('Election berhasil dibuat!');
      setIsLoading(false);
      router.push(`/dashboard`);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error('Terjadi kesalahan saat membuat election.');
    }
  };

  return (
    <div className='flex w-full h-screen bg-white font-sans overflow-hidden text-[#222222]'>

      {isLoading && (
        <div className='fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-[100]'>
          <LuLoader className='animate-spin text-[#FF8D1D] mb-4' size={60} />
          <h3 className='text-2xl font-black tracking-tight'>DEPLOYING ELECTION</h3>
          <p className='text-gray-500 mt-2'>Please confirm the transaction in your wallet...</p>
        </div>
      )}

      <div className='hidden md:flex flex-[3] relative bg-black'>
        <img
          src='/img/login-banner.png'
          alt='banner'
          className='absolute inset-0 w-full h-full object-cover opacity-70'
        />
        <div className='relative z-10 flex flex-col justify-end p-16 text-white bg-gradient-to-t from-black/90 to-transparent w-full'>
          <h2 className='text-4xl font-bold mb-4'>Launch Your Democracy</h2>
          <p className='text-gray-300 max-w-md leading-relaxed'>
            Set up a transparent, secure, and immutable election event in minutes. Powered by Ethereum smart contracts.
          </p>
        </div>
      </div>

      <div className='flex-[2] flex flex-col h-full bg-white overflow-y-auto'>
        <div className='py-6 px-8 md:px-12 shrink-0'>
          <Link href='/'>
            <button className='group flex items-center text-sm font-semibold text-gray-500 hover:text-black transition-colors'>
              <LuArrowLeft className='mr-2 group-hover:-translate-x-1 transition-transform' />
              Back
            </button>
          </Link>
        </div>

        <div className='flex-1 flex flex-col justify-center px-8 md:px-20 py-10'>
          <div className='mb-8'>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-4xl md:text-5xl font-black tracking-tight text-gray-900'>
                Create<br />Election
              </h1>
              <img src='/img/vector2.png' alt='' className='h-12 w-auto animate-pulse' />
            </div>
            <p className='text-gray-500 font-medium'>Define the details of your voting event.</p>
          </div>

          <div className='space-y-6'>

            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wider' htmlFor='electionName'>
                Election Title
              </label>
              <div className='relative group'>
                <LuPenTool className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' size={20} />
                <input
                  id='electionName'
                  type='text'
                  placeholder='e.g. Student Council Election 2024'
                  className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all font-bold text-gray-800 placeholder:font-normal'
                  value={electionName}
                  onChange={(e) => setElectionName(e.target.value)}
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-bold text-gray-500 uppercase tracking-wider' htmlFor='electionDesc'>
                Description
              </label>
              <div className='relative group'>
                <LuFileText className='absolute left-4 top-4 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' size={20} />
                <textarea
                  id='electionDesc'
                  placeholder='Describe the purpose of this election...'
                  className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all min-h-[120px] resize-none'
                  value={electionDesc}
                  onChange={(e) => setElectionDesc(e.target.value)}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider'>Start Time</label>
                <div className='relative group'>
                  <LuCalendarClock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' size={20} />
                  <input
                    type='datetime-local'
                    className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all text-sm font-medium text-gray-600'
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider'>End Time</label>
                <div className='relative group'>
                  <LuCalendarClock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors' size={20} />
                  <input
                    type='datetime-local'
                    className='w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all text-sm font-medium text-gray-600'
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className='pt-4'>
              <button
                type='button'
                onClick={onSubmit}
                disabled={isLoading}
                className='w-full bg-[#FF8D1D] hover:bg-[#ff9d3d] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-extrabold py-4 rounded-xl shadow-lg shadow-[#FF8D1D]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3'
              >
                {isLoading ? (
                  'Processing...'
                ) : (
                  <>
                    <LuRocket size={20} /> Deploy Election Contract
                  </>
                )}
              </button>
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
