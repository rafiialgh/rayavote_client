'use client';
import { getElection } from '@/services/election';
import React, { useCallback, useEffect, useState } from 'react';
import Chart from './Chart';
import { getDashboard } from '@/services/dashboard';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';

export default function Page() {
  interface Dashboard {
    candidates?: number;
    voters?: number;
    voted?: number;
    notVoted?: number;
  }

  const [dashboard, setDashboard] = useState<Dashboard>({});
  const [candidates, setCandidates] = useState<any[]>([]);
  const [numOfCandidate, setNumOfCandidate] = useState<number>(0);
  const [numOfVoter, setNumOfVoter] = useState<number>(0);
  const [electionDetail, setElectionDetail] = useState({
    name: '',
    description: ''
  })

  const getDashboardData = useCallback(async () => {
    try {
      const response = await getDashboard();
      if (!response.error) {
        setDashboard(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    }
  }, []);

  const fetchCandidates = useCallback(async () => {
    const address = Cookies.get('address');
    const Election = getElectionContract(address);

    if (!Election) {
      toast.error('Failed to get election contract.');
      return;
    }

    try {
      const numOfCandidates = await Election.getNumOfCandidates();
      setNumOfCandidate(numOfCandidates);

      const numOfVoters = await Election.getNumOfVoters()
      setNumOfVoter(numOfVoters)

      const candidatesData = await Promise.all(
        Array.from({ length: numOfCandidates }, (_, index) => 
          Election.getCandidate(index)
        )
      );

      const formattedCandidates = candidatesData.map(candidate => ({
        name: candidate[0],
        description: candidate[1],
        imgHash: candidate[2],
        voteCount: candidate[3],
        email: candidate[4],
      }));

      setCandidates(formattedCandidates);

      const election = await Election.getElectionDetails()
      setElectionDetail({
        name: election[0],
        description: election[1]
      })
    } catch (error) {
      toast.error('Gagal memuat data kandidat.');
    }
  }, []);

  useEffect(() => {
    getDashboardData();
    fetchCandidates();
  }, [getDashboardData, fetchCandidates]);

  const labels = candidates.map(candidate => candidate.name);
  const data = candidates.map(candidate => candidate.voteCount);

  return (
    <div>
      <h1 className='text-3xl font-bold mb-5 text-center p-5 bg-white rounded-lg border border-gray-300'>
        Dashboard
      </h1>
          <p>Election Name: {electionDetail.name}</p>
          <p>Election Description: {electionDetail.description}</p>
      <div className='flex justify-center items-center mb-10'>
        <div>
        </div>
        <div className='flex gap-10'>
          <div className='w-72 h-36 bg-black rounded-lg flex items-center justify-center'>
            <div>
              <p className='text-white text-2xl text-center'>Candidates</p>
              <p className='text-white text-2xl text-center'>{numOfCandidate}</p>
            </div>
          </div>
          <div className='w-72 h-36 bg-black rounded-lg flex items-center justify-center'>
            <div>
              <p className='text-white text-2xl text-center'>Voters</p>
              <p className='text-white text-2xl text-center'>{dashboard.voters}</p>
            </div>
          </div>
          <div className='w-72 h-36 bg-black rounded-lg flex items-center justify-center'>
            <div>
              <p className='text-white text-2xl text-center'>Voted</p>
              <p className='text-white text-2xl text-center'>{numOfVoter}</p>
            </div>
          </div>
          {/* <div className='w-72 h-36 bg-black rounded-lg flex items-center justify-center'>
            <div>
              <p className='text-white text-2xl text-center'>Not Voted</p>
              <p className='text-white text-2xl text-center'>{dashboard.notVoted}</p>
            </div>
          </div> */}
        </div>
      </div>
      <Chart labels={candidates.map(c => c.name)} data={candidates.map(c => c.voteCount)} />
    </div>
  );
}
