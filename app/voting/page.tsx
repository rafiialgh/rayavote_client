'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getCandidateVoter } from '@/services/candidate';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getElectionContract } from '@/utils/contract';
import { getElection } from '@/services/election';
import { LuCheck, LuX } from 'react-icons/lu';

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

  const [users, setUsers] = useState<any>();
  const [candidates, setCandidates] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');
  const [electionDetail, setElectionDetail] = useState({
    name: '',
    description: '',
  });
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const getUserDetail = useCallback(async () => {
    const email = Cookies.get('emailVoter');

    setUsers(email);
  }, []);

  const dateFormat = (date: any) => {
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return formattedDate;
  };

  const getElectionStatus = useCallback(async () => {
    const address = Cookies.get('address');
    const response = await getElection(address);
    setStartTime(response.data.startTime);
    setEndTime(response.data.endTime);
    setStatus(response.data.currentPhase);
    console.log(response);
  }, []);

  const getCandidateList = useCallback(async () => {
    console.log(status);
    const address = Cookies.get('address');
    const Election = getElectionContract(address);
    console.log(Election);
    if (!Election) {
      toast.error('Failed to get election contract.');
      return;
    }

    const numOfCandidates = await Election.getNumOfCandidates();
    console.log('Number of candidates:', numOfCandidates);

    const candidatesData = await Promise.all(
      Array.from({ length: numOfCandidates }, (_, index) =>
        Election.getCandidate(index)
      )
    );

    const formattedCandidates = candidatesData.map((candidate, index) => ({
      name: candidate[0],
      description: candidate[1],
      imgHash: candidate[2],
      voteCount: candidate[3],
      email: candidate[4],
      index,
    }));

    const election = await Election.getElectionDetails();
    setElectionDetail({
      name: election[0],
      description: election[1],
    });

    setCandidates(formattedCandidates);
    console.log('election ongoing');
  }, [getElectionStatus]);

  const handleVote = async (candidateIndex: number) => {
    const address = Cookies.get('address');
    const response = await getElection(address);
    const checkStatus = response.data.currentPhase;

    console.log(status);
    if (checkStatus == 'ongoing') {
      setIsLoading(true);
      setShowModal(false);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = Cookies.get('address');
      const Election = getElectionContract(address);

      if (!Election) {
        toast.error('Failed to get election contract.');
        return;
      }

      try {
        const email = Cookies.get('emailVoter');
        const tx = await Election.vote(selectedCandidate.index, email);
        await tx.wait();
        setIsLoading(false);
        setShowModal(false);
        console.log(tx);

        toast.success('Your vote has been successfully submitted!');

        const updatedCandidate = await Election.getCandidate(candidateIndex);

        const updatedCandidates = [...candidates];
        updatedCandidates[candidateIndex] = {
          ...updatedCandidates[candidateIndex],
          voteCount: updatedCandidate[3],
        };

        setCandidates(updatedCandidates);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setShowModal(false);
        toast.error('Failed to cast your vote.');
      }
    } else if (status == 'init') {
      toast.warning('Pemilihan belum dimulai');
      window.location.reload();
    } else {
      toast.warning('Pemilihan sudah selesai');
      window.location.reload();
    }
  };

  useEffect(() => {
    getElectionStatus();
    getUserDetail();
  }, [getUserDetail]);

  useEffect(() => {
    if (status) {
      getCandidateList();
    }
  }, [status]);

  return (
    <>
      <Navbar user={users} />
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded-md shadow-lg'>
            <p className='text-lg font-semibold'>Voting...</p>
          </div>
        </div>
      )}

      <div className='flex w-full justify-center items-center'>
        {status == 'init' && (
          <div className='p-5 bg-yellow-400 rounded-lg border border-gray-300 flex flex-col items-center justify-center font-sans'>
            <p>Pemilihan belum dimulai</p>
            <p>Waktu mulai: {dateFormat(startTime)}</p>
          </div>
        )}

        {status == 'completed' && (
          <div className='flex flex-col'>
            <div className='p-5 mb-5 bg-yellow-400 rounded-lg border border-gray-300 flex flex-col items-center justify-center font-sans'>
              <p>Pemilihan sudah berakhir</p>
              <p>Waktu berakhir: {dateFormat(endTime)}</p>
            </div>
            <div className='p-5 bg-gray-100 rounded-lg border border-gray-400 '>
              <div className='flex flex-col items-center justify-center'>
                <div className='w-fit px-2 py-1 bg-white rounded-sm border border-gray-300 font-sans uppercase'>
                  <p>{electionDetail.name}</p>
                </div>
                <div className='px-2 py-1 w-fit mt-2 bg-yellow-400 rounded-sm border border-gray-300 font-sans text-sm uppercase'>
                  <p>{`${dateFormat(startTime)} - ${dateFormat(endTime)}`}</p>
                </div>
              </div>
              <div
                className={`grid grid-cols-${
                  candidates.length > 1 ? 2 : 1
                } gap-14 m-10`}
              >
                {candidates.map((candidate: any, index: any) => {
                  return (
                    <div
                      className='w-72 h-full p-3 bg-white rounded-lg border border-gray-400'
                      key={index}
                    >
                      <div className='w-full h-56 rounded-lg overflow-hidden border border-gray-400 mb-3'>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMG}/${candidate.imgHash}`}
                          alt={candidate.name}
                          width={100}
                          height={100}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <h1 className='text-xl mb-1'>
                        {candidate.name} #{index + 1}
                      </h1>
                      <p className='text-sm font-sans break-words mb-1'>
                        {candidate.description}
                      </p>
                      <p className='font-sans text-sm mb-2 py-1 px-2 bg-green-300 border border-gray-300 w-fit rounded-md'>
                        Vote Count: {candidate.voteCount}
                      </p>
                      
                    </div>
                  );
                })}
                
              </div>
            </div>
          </div>
        )}

        {status == 'ongoing' && (
          <>
            <div className='p-5 bg-gray-100 rounded-lg border border-gray-400 '>
              <div className='flex flex-col items-center justify-center'>
                <div className='w-fit px-2 py-1 bg-white rounded-sm border border-gray-300 font-sans uppercase'>
                  <p>{electionDetail.name}</p>
                </div>
                <div className='px-2 py-1 w-fit mt-2 bg-yellow-400 rounded-sm border border-gray-300 font-sans text-sm uppercase'>
                  <p>{`${dateFormat(startTime)} - ${dateFormat(endTime)}`}</p>
                </div>
              </div>
              <div
                className={`grid grid-cols-${
                  candidates.length > 1 ? 2 : 1
                } gap-14 m-10`}
              >
                {candidates.map((candidate: any, index: any) => {
                  return (
                    <div
                      className='w-72 h-full p-3 bg-white rounded-lg border border-gray-400'
                      key={index}
                    >
                      <div className='w-full h-56 rounded-lg overflow-hidden border border-gray-400 mb-3'>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMG}/${candidate.imgHash}`}
                          alt={candidate.name}
                          width={100}
                          height={100}
                          className='w-full h-full object-cover'
                        />
                      </div>
                      <h1 className='text-xl mb-1'>
                        {candidate.name} #{index + 1}
                      </h1>
                      <p className='text-sm font-sans break-words mb-1'>
                        {candidate.description}
                      </p>
                      <p className='font-sans text-sm mb-2 py-1 px-2 bg-green-300 border border-gray-300 w-fit rounded-md'>
                        Vote Count: {candidate.voteCount}
                      </p>
                      <div className='w-full mt-6'>
                        <button
                          onClick={() => {
                            setSelectedCandidate(candidate);
                            setShowModal(true);
                          }}
                          className='bg-[#FF8D1D] hover:shadow-lg transition-all p-2 w-full rounded-md'
                        >
                          Vote
                        </button>
                      </div>
                    </div>
                  );
                })}
                {showModal && (
                  <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white p-5 rounded-md shadow-lg w-96'>
                      <h2 className='text-xl font-bold'>Konfirmasi Voting</h2>
                      <p>
                        Apakah Anda yakin ingin memilih{' '}
                        {selectedCandidate?.name}?
                      </p>
                      <div className='flex justify-end mt-4 gap-2'>
                        <button
                          className='flex justify-center items-center bg-red-500 p-2 rounded-md text-white'
                          onClick={() => setShowModal(false)}
                        >
                          <span className='mr-3'>
                            <LuX />
                          </span>
                          Batal
                        </button>
                        <button
                          className='flex justify-center items-center bg-green-500 p-2 rounded-md text-white'
                          onClick={() => handleVote(selectedCandidate.index)}
                        >
                          <span className='mr-3'>
                            <LuCheck />
                          </span>
                          Ya, Vote
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
