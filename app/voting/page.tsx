'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getCandidateVoter } from '@/services/candidate';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getElectionContract } from '@/utils/contract';

export default function Voting() {
  interface Candidate {
    _id: string;
    username: string;
    firstName: string;
    lastName?: string;
    dateOfBirth: string;
    degree: string;
    description: string;
  }

  interface Voter {
    _id: string;
    nim: string;
    name: string;
    email: string;
  }

  interface DecodedToken {
    voter: Voter;
  }

  const [users, setUsers] = useState<any>()
  const [candidates, setCandidates] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false)

  const getUserDetail = useCallback(async () => {
    const email = Cookies.get('emailVoter');
    
    setUsers(email);
  }, []);


  const getCandidateList = useCallback(async () => {
    const address = Cookies.get('address');
      const Election = getElectionContract(address);
      console.log(Election);
      if (!Election) {
        toast.error('Failed to get election contract.');
        return;
      }

      // Get the number of candidates
      const numOfCandidates = await Election.getNumOfCandidates();
      console.log('Number of candidates:', numOfCandidates);

      // Fetch data for all candidates concurrently
      const candidatesData = await Promise.all(
        Array.from({ length: numOfCandidates }, (_, index) => 
          Election.getCandidate(index)
        )
      );

      // Map the fetched data to a structured format and update state
      const formattedCandidates = candidatesData.map(candidate => ({
        name: candidate[0],
        description: candidate[1],
        imgHash: candidate[2],
        voteCount: candidate[3],
        email: candidate[4],
      }));

      // Update state with all candidates data
      setCandidates(formattedCandidates);
  }, []);

  const handleVote = async (candidateIndex: number) => {
    setIsLoading(true)
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = Cookies.get('address');
    const Election = getElectionContract(address);

    if (!Election) {
      toast.error('Failed to get election contract.');
      return;
    }

    try {
      // Panggil fungsi vote di smart contract
      const email = Cookies.get('emailVoter')
      const tx = await Election.vote(candidateIndex, email);
      await tx.wait(); 
      setIsLoading(false)
      console.log(tx)// Tunggu hingga transaksi selesai

      toast.success('Your vote has been successfully submitted!');
      
      const updatedCandidate = await Election.getCandidate(candidateIndex);
    
    // Update state dengan vote count terbaru
    const updatedCandidates = [...candidates];
    updatedCandidates[candidateIndex] = {
      ...updatedCandidates[candidateIndex],
      voteCount: updatedCandidate[3] // Mendapatkan voteCount terbaru dari smart contract
    };
    
    // Update state dengan kandidat yang sudah diupdate
    setCandidates(updatedCandidates);

    } catch (error) {
      console.error(error);
      setIsLoading(false)
      toast.error('Failed to cast your vote.');
    }
  };

  useEffect(() => {
    getCandidateList();
    getUserDetail()
  }, [getCandidateList, getUserDetail]);

  return (
    <>
      <Navbar user={users}/>
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded-md shadow-lg'>
            <p className='text-lg font-semibold'>Voting...</p>
          </div>
        </div>
      )}
      <div className='flex w-full justify-center items-center'>
        <div className='p-10 bg-[#D9D9D9] rounded-lg border border-gray-400 grid grid-cols-2 gap-14 m-10'>
          {candidates.map((candidate: any, index: any) => {
            return (
              <div
                className='w-72 h-fit p-3 bg-white rounded-lg border border-gray-400'
                key={index}
              >
                <div className='w-full h-56 rounded-lg overflow-hidden border border-gray-400 mb-3'>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMG}/${candidate.imgHash}`}
                    alt='profile2'
                    width={100}
                    height={100}
                    className='w-full h-full object-cover'
                  />
                </div>
                <h1 className='text-xl mb-1'>
                  {candidate.name} #{index + 1}
                </h1>
                {/* <p className='font-sans text-sm'>
                  Date of birth:{' '}
                  {new Date(candidate.dateOfBirth).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p> */}
                <p className='text-sm font-sans text-balance'>
                  {candidate.description}
                </p>
                <p className='font-sans text-sm mb-2'>
                  Vote Count: {candidate.voteCount}
                </p>
                <div className='w-full mt-6'>
                  <button onClick={() => handleVote(index)} className='bg-[#FF8D1D] p-2 w-full rounded-md'>
                    Vote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
