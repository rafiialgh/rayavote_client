'use client';
import { editElection, getElection } from '@/services/election';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { getElectionContract } from '@/utils/contract';
import { sendResult } from '@/services/result';

export default function Election() {
  const phases = [
    { value: 'init', label: 'Initialization' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const [formData, setFormData] = useState({
    _id: '',
    electionName: '',
    electionDesc: '',
    currentPhase: '',
  });

  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [electionDetail, setElectionDetail] = useState({
    name: '',
    description: '',
  });

  const [candidate, setCandidate] = useState<any>([]);

  // const getElectionData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await getElection();
  //     const { _id, electionName, electionDesc, currentPhase } = response.data[0];
  //     console.log(response.data[0]);
  //     if (!response.error) {
  //       setFormData({ _id, electionName, electionDesc, currentPhase });
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error('Gagal memuat data Election');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getElection]);

  const getElectionData = useCallback(async () => {
    const address = Cookies.get('address');
    const Election = getElectionContract(address);

    if (!Election) {
      toast.error('Failed to get election contract.');
      return;
    }

    const election = await Election.getElectionDetails();
    setElectionDetail({
      name: election[0],
      description: election[1],
    });

    const winnerData = localStorage.getItem('winnerCandidate');
    if (winnerData) {
      setCandidate(JSON.parse(winnerData));
    }
  }, []);

  useEffect(() => {
    getElectionData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEndElection = async () => {
    setLoading(true);
    const address = Cookies.get('address');
    const Election = getElectionContract(address);

    if (!Election) {
      toast.error('Failed to get election contract.');
      return;
    }

    const candidateWinner = await Election.winnerCandidate();
    console.log(candidateWinner);

    const getWinnerDetail = await Election.getCandidate(candidateWinner);
    console.log(getWinnerDetail);

    const winnerData = {
      name: getWinnerDetail[0],
      description: getWinnerDetail[1],
      imgHash: getWinnerDetail[2],
      voteCount: getWinnerDetail[3],
      email: getWinnerDetail[4],
    };

    setCandidate(winnerData);
    localStorage.setItem('winnerCandidate', JSON.stringify(winnerData));
    toast.success('Election ended successfully.');
    setLoading(false);
  };

  const handleSendEmail = async () => {
    setEmailLoading(true)
    const address = Cookies.get('address');

    if (!candidate || !candidate.name) {
      toast.error('Please end the election to get the winner first.');
      setEmailLoading(false);
      return;
    }

    const response = await sendResult({
      electionAddress: address,
      electionName: electionDetail.name,
      winnerCandidate: candidate.name,
    });
    console.log("🚀 ~ handleSendEmail ~ response:", response)

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(`${'totalEmails' in response ? response.totalEmails : ''} ${response.message}`);
    }
    setEmailLoading(false)
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   setLoading(true);

  //   try {
  //     const response = await editElection(formData._id, formData);
  //     console.log(response);
  //     if (!response.error) {
  //       toast.success(response.message);
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error('Gagal memperbarui election');
  //   } finally {
  //     setLoading(false)
  //   }
  // };

  return (
    <>
      <div className='w-full h-full rounded-lg bg-white p-5 border border-gray-300'>
        <div className='bg-gray-100 w-full rounded-md p-5'>
          <div className=''>
            <h1 className='text-xl'>Election Setting</h1>
            <div className='mt-10'>
              {/* <form className=''> */}
              <div className='mb-4 flex gap-20 items-center'>
                <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                  Election Name
                </label>
                <input
                  type='text'
                  name='electionName'
                  value={electionDetail.name}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border rounded-lg font-sans flex-1'
                />
              </div>
              <div className='mb-4 flex gap-20 items-center'>
                <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                  Election Description
                </label>
                <textarea
                  name='electionDesc'
                  value={electionDetail.description}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border rounded-lg font-sans flex-1'
                  rows={4}
                  cols={50}
                />
              </div>
              {/* <div className='mt-20 mb-10'>
                  <h1 className='text-xl'>Phase</h1>
                </div>
                <div className='flex items-center gap-20'>
                  <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                    Election Phase
                  </label>
                  <select
                    name='currentPhase'
                    value={formData.currentPhase}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border rounded-lg font-sans flex-1'
                  >
                    <option value=''>Select Phase</option>
                    {phases.map((phase) => (
                      <option key={phase.value} value={phase.value}>
                        {phase.label}
                      </option>
                    ))}
                  </select>
                </div> */}

              {candidate && candidate.name && (
                <div className='flex justify-center items-center'>
                  <div className='p-5 bg-white border border-gray-300 rounded-lg '>
                    <h1 className='text-center mb-5 text-xl'>
                      Winner Candidate
                    </h1>
                    <div className='flex items-center gap-10'>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMG}/${candidate.imgHash}`}
                        alt='profile'
                        width={100}
                        height={100}
                        className='w-28 h-full object-cover border border-gray-300 rounded-lg'
                      />
                      <div>
                        <p>Name: {candidate.name}</p>
                        <p>Desc: {candidate.description}</p>
                        <p>Vote Count: {candidate.voteCount}</p>
                        <p>Email: {candidate.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='mt-10 flex justify-center gap-5'>
                <button
                  // type='submit'
                  className='bg-red-500 text-white px-5 py-2 rounded-lg'
                  disabled={loading}
                  onClick={handleEndElection}
                >
                  {loading ? 'Ending...' : 'End Election'}
                </button>
                <button
                  className='bg-blue-500 text-white px-5 py-2 rounded-lg'
                  disabled={emailLoading}
                  onClick={handleSendEmail}
                >
                  {emailLoading ? 'Sending...' : 'Send Email'}
                </button>
              </div>
              {/* </form> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
