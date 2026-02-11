'use client';
import { getElection } from '@/services/election';
import React, { useCallback, useEffect, useState } from 'react';
import Chart from './Chart'; 
import { getDashboard } from '@/services/dashboard';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';
import Navbar from './Navbar';
import { 
  LuCalendarClock, 
  LuUsers, 
  LuVote, 
  LuCheck, 
  LuTrendingUp, 
  LuActivity
} from 'react-icons/lu';

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
    description: '',
  });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');

  const getElectionStatus = useCallback(async () => {
    const address = Cookies.get('address');
    if (!address) return;
    try {
      const response = await getElection(address);
      setStartTime(response.data.startTime);
      setEndTime(response.data.endTime);
      setStatus(response.data.currentPhase);
    } catch (e) { console.error(e); }
  }, []);

  const dateFormat = (date: any) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getDashboardData = useCallback(async () => {
    try {
      const response = await getDashboard();
      if (!response.error) {
        setDashboard(response.data);
      }
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    }
  }, []);

  const fetchCandidates = useCallback(async () => {
    const address = Cookies.get('address');
    if (!address) return;
    
    const Election = getElectionContract(address);
    if (!Election) {
      toast.error('Contract not found.');
      return;
    }

    try {
      const nCandidates = await Election.getNumOfCandidates();
      setNumOfCandidate(Number(nCandidates));

      const nVoters = await Election.getNumOfVoters();
      setNumOfVoter(Number(nVoters));

      const candidatesData = await Promise.all(
        Array.from({ length: Number(nCandidates) }, (_, index) => Election.getCandidate(index))
      );

      const formattedCandidates = candidatesData.map((candidate) => ({
        name: candidate[0],
        description: candidate[1],
        imgHash: candidate[2],
        voteCount: Number(candidate[3]),
        email: candidate[4],
      }));

      setCandidates(formattedCandidates);

      const election = await Election.getElectionDetails();
      setElectionDetail({
        name: election[0],
        description: election[1],
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getDashboardData();
    fetchCandidates();
    getElectionStatus();
  }, [getDashboardData, fetchCandidates, getElectionStatus]);


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222]">
      <Navbar />
      
      <div className="pt-28 pb-10 px-6 max-w-[1280px] mx-auto">
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  status === 'ongoing' ? 'bg-green-100 text-green-700' : 
                  status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {status === 'init' ? 'Upcoming' : status}
                </span>
                <span className="text-gray-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wider">
                  <LuActivity size={14} /> Live Dashboard
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-3 leading-tight">
                {electionDetail.name || 'Loading Election...'}
              </h1>
              <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                {electionDetail.description}
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 min-w-full lg:min-w-[320px]">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
                 <div className="bg-[#FF8D1D] p-2 rounded-lg text-black">
                    <LuCalendarClock size={20} />
                 </div>
                 <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Event Timeline</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Start Date</p>
                  <p className="text-gray-900 font-bold text-lg">{dateFormat(startTime)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">End Date</p>
                  <p className="text-gray-900 font-bold text-lg">{dateFormat(endTime)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-[#FF8D1D]/50 transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <LuUsers size={28} />
              </div>
              <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Database</span>
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-2">{numOfCandidate}</h3>
            <p className="text-gray-500 font-medium">Registered Candidates</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-[#FF8D1D]/50 transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-purple-50 p-4 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <LuCheck size={28} />
              </div>
              <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Verified</span>
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-2">{dashboard.voters || 0}</h3>
            <p className="text-gray-500 font-medium">Eligible Voters</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 hover:border-[#FF8D1D]/50 transition-colors group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#FF8D1D]/10 p-4 rounded-2xl text-[#FF8D1D] group-hover:bg-[#FF8D1D] group-hover:text-black transition-colors duration-300">
                <LuVote size={28} />
              </div>
              <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Blockchain</span>
            </div>
            <h3 className="text-5xl font-black text-gray-900 mb-2">{numOfVoter}</h3>
            <p className="text-gray-500 font-medium">Total Votes Cast</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-xl">
                <LuTrendingUp size={24} className="text-gray-700"/>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Live Result Analysis</h2>
                <p className="text-sm text-gray-500">Real-time vote counting from smart contract</p>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[450px] flex items-center justify-center bg-slate-50 rounded-2xl border border-gray-100 p-6">
             {candidates.length > 0 ? (
                <Chart
                  labels={candidates.map((c) => c.name)}
                  data={candidates.map((c) => c.voteCount)}
                />
             ) : (
                <div className="text-center text-gray-400 flex flex-col items-center">
                   <LuActivity size={40} className="mb-2 opacity-20"/>
                   <p className="font-bold">No data available yet.</p>
                </div>
             )}
          </div>
        </div>
        
      </div>
    </div>
  );
}