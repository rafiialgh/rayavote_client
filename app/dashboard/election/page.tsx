'use client';
import { editElection, getElection } from '@/services/election';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { getElectionContract } from '@/utils/contract';
import { sendResult } from '@/services/result';

export default function Election() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');

  const formatDateTime = (isoString: any) => {
    console.log(isoString);
    if (!isoString) return '';
    const date = new Date(isoString); // Mengubah ISO string menjadi objek Date
    console.log(date.toLocaleString());
    console.log(new Date(date.getTime() - date.getTimezoneOffset() * 60000));
    return date.toISOString().slice(0, 16);
  };

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

  const handleStartTimeChange = (e: any) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: any) => {
    setEndTime(e.target.value);
  };

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

    const response = await getElection(address);
    setStartTime(response.data.startTime);
    setEndTime(response.data.endTime);
    setStatus(response.data.currentPhase);
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
    setEmailLoading(true);
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
    console.log('🚀 ~ handleSendEmail ~ response:', response);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(
        `${'totalEmails' in response ? response.totalEmails : ''} ${
          response.message
        }`
      );
    }
    setEmailLoading(false);
  };

  const handleTimeChange = async (e: any) => {
    try {
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

      console.log(isoStartTime);
      console.log(isoEndTime);

      console.log(isoStartTime.toISOString());
      console.log(isoEndTime.toISOString());

      const address = Cookies.get('address');
      const response = await editElection(address, {
        startTime: isoStartTime.toISOString(),
        endTime: isoEndTime.toISOString(),
      });
      console.log(response);
      const checkStatus = await getElection(address);
      setStatus(checkStatus.data.currentPhase);

      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error('Failed to update election time.');
    }
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
                  disabled
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
                  disabled
                />
              </div>
              <div className='mb-4 flex gap-20 items-center'>
                <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                  Election Phase
                </label>
                <input
                  name='status'
                  value={status}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border rounded-lg font-sans flex-1'
                  disabled
                />
              </div>
              <div className='mb-4 flex gap-20 items-center'>
                <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                  Time
                </label>
                <input
                  name='time'
                  value={`${dateFormat(startTime)} - ${dateFormat(endTime)}`}
                  className='w-fit px-3 py-2 border rounded-lg font-sans flex-1'
                  disabled
                />
              </div>
              <div className='mb-4 flex gap-20 items-center'>
                <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                  Start Time
                </label>

                <input
                  type='datetime-local'
                  className='border p-2 mb-3 font-sans'
                  // value={startTime}
                  onChange={handleStartTimeChange}
                />
              </div>
              <div className='mb-5 flex gap-20 items-center'>
                <label className='block flex-2 text-gray-700 font-medium mb-2 w-32'>
                  End Time
                </label>
                <input
                  type='datetime-local'
                  className='border p-2 font-sans'
                  // value={endTime}
                  onChange={handleEndTimeChange}
                />
              </div>
              <button
                className='bg-green-500 text-white px-5 py-2 rounded-lg ml-[210px]'
                onClick={handleTimeChange}
              >
                Set Time
              </button>

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
