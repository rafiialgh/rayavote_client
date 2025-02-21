'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
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

        const response = await setElection({
          electionAddress: deployedAddress,
          startTime,
          endTime,
        });
      }

      console.log(`Success - ${tx.hash}`);
      toast.success('Election berhasil dibuat!');
      setIsLoading(false);
      router.push(`/dashboard`);
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat membuat election.');
    }
  };

  return (
    <>
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded-md shadow-lg'>
            <p className='text-lg font-semibold'>Creating Election...</p>
          </div>
        </div>
      )}
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
                Create <br /> Election
              </h1>
              <img src='/img/vector2.png' alt='' className='h-[82px]' />
            </div>

            <div className='w-full h-fit bg-[#D9D9D9] p-3 rounded-lg'>
              <div className='w-full h-full bg-white rounded-sm px-5 py-10 flex flex-col'>
                <label htmlFor='electionName'>Election Name</label>
                <input
                  type='text'
                  placeholder='Election name'
                  className='border border-black rounded-sm p-2 mb-5 font-sans'
                  value={electionName}
                  onChange={(event) => setElectionName(event.target.value)}
                />

                <label htmlFor='electionDescription'>
                  Election Description
                </label>
                <textarea
                  placeholder='Election description'
                  className='border border-black rounded-sm p-2 mb-5 font-sans'
                  value={electionDesc}
                  onChange={(event) => setElectionDesc(event.target.value)}
                  rows={4}
                  cols={50}
                />

                <label>Start Time</label>
                <input
                  type='datetime-local'
                  className='border p-2 mb-3 font-sans'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />

                <label>End Time</label>
                <input
                  type='datetime-local'
                  className='border p-2 mb-5 font-sans'
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />

                <div className=''>
                  <button
                    type='button'
                    onClick={onSubmit}
                    className='bg-[#FF8D1D] w-full p-2 border border-black rounded-sm hover:bg-[#FF9E3D] transition'
                  >
                    Create election
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
