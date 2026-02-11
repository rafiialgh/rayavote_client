'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar'; // Pastikan path import Navbar benar
import Cookies from 'js-cookie';
import { LuPlus, LuSearch, LuFilter, LuLoader, LuUserX } from 'react-icons/lu';
import TableRow from './TableRow';
import { toast } from 'react-toastify';
import { getElectionContract } from '@/utils/contract';
import Link from 'next/link';

export default function Candidate() {
  const [candidates, setCandidates] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const address = Cookies.get('address');
        if (!address) {
            setIsLoading(false);
            return;
        }

        const Election = getElectionContract(address);
        if (!Election) {
          toast.error('Failed to connect to smart contract.');
          return;
        }

        const numOfCandidates = await Election.getNumOfCandidates();
        
        const candidatesData = await Promise.all(
          Array.from({ length: Number(numOfCandidates) }, (_, index) => 
            Election.getCandidate(index)
          )
        );

        const formattedCandidates = candidatesData.map((candidate, index) => ({
          id: index, 
          name: candidate[0],
          description: candidate[1],
          imgHash: candidate[2],
          voteCount: Number(candidate[3]),
          email: candidate[4],
        }));

        setCandidates(formattedCandidates);
      } catch (error) {
        console.error(error);
        toast.error('Gagal memuat data dari Blockchain');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCandidates = candidates.filter((c: any) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222]">
      <Navbar />

      <div className="pt-28 pb-10 px-6 max-w-[1280px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                    Candidate Management
                </h1>
                <p className="text-gray-500">
                    Manage profiles and view vote counts stored on the blockchain.
                </p>
            </div>
            
            <Link href='/dashboard/candidate/add'>
                <button className='flex items-center gap-2 bg-black hover:bg-[#FF8D1D] hover:text-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#FF8D1D]/20 active:scale-95'>
                    <LuPlus size={20} />
                    <span>Add New Candidate</span>
                </button>
            </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96 group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors w-full md:w-auto justify-center">
                <LuFilter size={18} />
                <span>Filter</span>
            </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Profile</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Candidate Info</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Vision / Description</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Votes</th>
                            {/* <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-6"><div className="w-12 h-12 bg-gray-200 rounded-xl"></div></td>
                                    <td className="p-6"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-200 rounded w-20"></div></td>
                                    <td className="p-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                                    <td className="p-6"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                                    <td className="p-6"><div className="h-8 bg-gray-200 rounded w-12 mx-auto"></div></td>
                                </tr>
                            ))
                        ) : filteredCandidates.length > 0 ? (
                            filteredCandidates.map((candidate: any, index: number) => (
                                <TableRow
                                    key={index}
                                    {...candidate}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                                            <LuUserX size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-600">No Candidates Found</h3>
                                        <p className="text-sm">Try adjusting your search or add a new candidate.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}