'use client';
import { editElection, getElection } from '@/services/election';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { getElectionContract } from '@/utils/contract';
import { sendResult } from '@/services/result';
import Navbar from '../Navbar';
import { 
  LuCalendarClock, 
  LuTrophy, 
  LuTriangleAlert, 
  LuMail, 
  LuTimer, 
  LuInfo, 
  LuSave,
  LuBan,
  LuCheck
} from 'react-icons/lu';

export default function Election() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [candidate, setCandidate] = useState<any>([]);
  
  const [electionDetail, setElectionDetail] = useState({
    name: '',
    description: '',
  });

  const dateFormat = (date: any) => {
    if(!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getElectionData = useCallback(async () => {
    const address = Cookies.get('address');
    if(!address) return;

    try {
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
    } catch (error) {
        console.error(error);
    }
  }, []);

  useEffect(() => {
    getElectionData();
  }, [getElectionData]);


  const handleTimeChange = async () => {
    try {
      if (!startTime || !endTime) {
        toast.warning('Start time and end time cannot be empty.');
        return;
      }

      setLoading(true);
      
      const localStartTime = new Date(startTime);
      const localEndTime = new Date(endTime);
      
      // Ensure ISO format
      const isoStartTime = new Date(localStartTime.toISOString());
      const isoEndTime = new Date(localEndTime.toISOString());

      const address = Cookies.get('address');
      const response = await editElection(address, {
        startTime: isoStartTime.toISOString(),
        endTime: isoEndTime.toISOString(),
      });

      const checkStatus = await getElection(address);
      setStatus(checkStatus.data.currentPhase);

      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success('Election timeline updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update election time.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndElection = async () => {
    if(!window.confirm("Are you sure you want to end this election manually? This action is irreversible on the blockchain.")) return;

    setLoading(true);
    try {
        const address = Cookies.get('address');
        const Election = getElectionContract(address);

        if (!Election) throw new Error('Contract unavailable');

        const candidateWinner = await Election.winnerCandidate();
        const getWinnerDetail = await Election.getCandidate(candidateWinner);

        const winnerData = {
            name: getWinnerDetail[0],
            description: getWinnerDetail[1],
            imgHash: getWinnerDetail[2],
            voteCount: Number(getWinnerDetail[3]),
            email: getWinnerDetail[4],
        };

        setCandidate(winnerData);
        localStorage.setItem('winnerCandidate', JSON.stringify(winnerData));
        toast.success('Election ended. Winner determined!');
        
        getElectionData();

    } catch (error) {
        console.error(error);
        toast.error('Failed to end election on blockchain.');
    } finally {
        setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!candidate || !candidate.name) {
      toast.warning('No winner found. End the election first.');
      return;
    }

    setEmailLoading(true);
    const address = Cookies.get('address');

    try {
        const response = await sendResult({
          electionAddress: address,
          electionName: electionDetail.name,
          winnerCandidate: candidate.name,
        });

        if (response.error) {
          toast.error(response.message);
        } else {
          toast.success(`Results sent successfully!`);
        }
    } catch (error) {
        toast.error("Failed to send emails.");
    } finally {
        setEmailLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222]">
      <Navbar />

      <div className="pt-28 pb-10 px-6 max-w-[1280px] mx-auto">
        
        <div className="mb-8">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                Election Settings
            </h1>
            <p className="text-gray-500">
                Configure timeline, manage phases, and finalize the election results.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
                
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <LuInfo size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">General Information</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Election Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-800">
                                    {electionDetail.name || 'Loading...'}
                                </div>
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Phase</label>
                                <div className="flex items-center">
                                    <span className={`px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-sm w-full border ${
                                        status === 'ongoing' ? 'bg-green-100 text-green-700 border-green-200' :
                                        status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    }`}>
                                        {status === 'init' ? 'Upcoming / Init' : status}
                                    </span>
                                </div>
                             </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 font-medium text-gray-600 leading-relaxed min-h-[100px]">
                                {electionDetail.description || 'No description provided.'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#FF8D1D]/10 p-2 rounded-lg text-[#FF8D1D]">
                            <LuTimer size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Timeline Configuration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Time</label>
                            <div className="relative group">
                                <LuCalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D]" />
                                <input
                                    type="datetime-local"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none font-bold text-gray-800"
                                    value={startTime ? new Date(startTime).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">End Time</label>
                            <div className="relative group">
                                <LuCalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D]" />
                                <input
                                    type="datetime-local"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none font-bold text-gray-800"
                                    value={endTime ? new Date(endTime).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={handleTimeChange}
                            disabled={loading}
                            className="bg-black hover:bg-[#FF8D1D] hover:text-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#FF8D1D]/20 flex items-center gap-2"
                        >
                            <LuSave size={18} /> Update Timeline
                        </button>
                    </div>
                </div>

            </div>

            <div className="space-y-8">
                
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-red-50 p-2 rounded-lg text-red-600">
                            <LuTriangleAlert size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Control Zone</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <button 
                            onClick={handleEndElection}
                            disabled={loading}
                            className="w-full py-4 rounded-xl font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <><LuBan size={18} /> End Election Now</>
                            )}
                        </button>
                        <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
                            Ending the election will calculate the winner on the blockchain. This cannot be undone.
                        </p>

                        <div className="h-px bg-gray-100 my-4"></div>

                        <button 
                            onClick={handleSendEmail}
                            disabled={emailLoading}
                            className="w-full py-4 rounded-xl font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                             {emailLoading ? 'Sending...' : (
                                <><LuMail size={18} /> Broadcast Results</>
                            )}
                        </button>
                        <p className="text-xs text-gray-400 text-center leading-relaxed px-4">
                            Send result notification emails to all registered voters.
                        </p>
                    </div>
                </div>

                {candidate && candidate.name ? (
                     <div className="bg-yellow-50 rounded-3xl p-8 shadow-sm border border-yellow-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <LuTrophy size={150} className="text-yellow-600" />
                        </div>
                        
                        <div className="relative z-10 text-center">
                            <div className="inline-flex bg-white/50 backdrop-blur border border-yellow-200 px-4 py-1 rounded-full text-xs font-black text-yellow-700 uppercase tracking-widest mb-6">
                                Election Winner
                            </div>

                            <div className="w-24 h-24 mx-auto bg-white p-1 rounded-full shadow-lg mb-4">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_IMG}/${candidate.imgHash}`}
                                    alt="winner"
                                    width={100}
                                    height={100}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-1">{candidate.name}</h3>
                            <p className="text-sm font-bold text-yellow-700 mb-4">{candidate.voteCount} Votes</p>

                            <div className="bg-white/60 rounded-xl p-4 text-left">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Winning Vision</p>
                                <p className="text-sm text-gray-700 line-clamp-3 italic">
                                    {candidate.description}
                                </p>
                            </div>
                        </div>
                     </div>
                ) : (
                    <div className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-300 text-center">
                        <LuTrophy size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-400">No Winner Yet</h3>
                        <p className="text-sm text-gray-400 mt-2">End the election to calculate and display the result.</p>
                    </div>
                )}

            </div>
        </div>

      </div>
    </div>
  );
}