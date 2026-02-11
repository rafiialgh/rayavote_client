'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';
import { getElection } from '@/services/election';
import {
  LuCheck,
  LuX,
  LuLoader,
  LuClock,
  LuCalendarDays,
  LuVote,
  LuTrophy,
  LuUsers
} from 'react-icons/lu';

export default function Voting() {
  interface Candidate {
    name: string;
    description: string;
    imgHash: string;
    voteCount: string;
    index: number;
  }

  const [users, setUsers] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('');
  const [electionDetail, setElectionDetail] = useState({
    name: '',
    description: '',
  });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getUserDetail = useCallback(async () => {
    const email = Cookies.get('emailVoter');
    setUsers(email || '');
  }, []);

  const dateFormat = (date: any) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getElectionStatus = useCallback(async () => {
    const address = Cookies.get('address');
    if (address) {
      const response = await getElection(address);
      setStartTime(response.data.startTime);
      setEndTime(response.data.endTime);
      setStatus(response.data.currentPhase);
    }
  }, []);

  const getCandidateList = useCallback(async () => {
    const address = Cookies.get('address');
    if (!address) return;

    const Election = getElectionContract(address);
    if (!Election) {
      toast.error('Gagal memuat kontrak pemilihan.');
      return;
    }

    const numOfCandidates = await Election.getNumOfCandidates();
    const candidatesData = await Promise.all(
      Array.from({ length: numOfCandidates }, (_, index) => Election.getCandidate(index))
    );

    const formattedCandidates = candidatesData.map((candidate, index) => ({
      name: candidate[0],
      description: candidate[1],
      imgHash: candidate[2],
      voteCount: candidate[3].toString(),
      email: candidate[4],
      index,
    }));

    const election = await Election.getElectionDetails();
    setElectionDetail({
      name: election[0],
      description: election[1],
    });

    setCandidates(formattedCandidates);
  }, []);

  const handleVote = async (candidateIndex: number) => {
    if (!selectedCandidate) return;

    if (status === 'ongoing') {
      setIsLoading(true);
      setShowModal(false);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = Cookies.get('address');
        const Election = getElectionContract(address);
        const email = Cookies.get('emailVoter');

        const tx = await Election.vote(candidateIndex, email);
        await tx.wait();

        toast.success('Suara berhasil disimpan di blockchain!');
        getCandidateList();
      } catch (error) {
        console.error(error);
        toast.error('Gagal melakukan voting.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning('Pemilihan sedang tidak aktif.');
    }
  };

  useEffect(() => {
    getElectionStatus();
    getUserDetail();
  }, [getUserDetail, getElectionStatus]);

  useEffect(() => {
    if (status) {
      getCandidateList();
    }
  }, [status, getCandidateList]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222] pb-20">
      <Navbar user={users} />

      {isLoading && (
        <div className='fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[100]'>
          <div className='flex flex-col items-center animate-pulse'>
            <LuLoader className='animate-spin text-[#FF8D1D] mb-4' size={50} />
            <h3 className='text-xl font-black tracking-tight'>MEMPROSES SUARA</h3>
            <p className='text-gray-500 text-sm mt-2'>Mencatat transaksi ke Blockchain...</p>
          </div>
        </div>
      )}

      <div className='pt-28 px-4 md:px-8 max-w-[1200px] mx-auto'>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Election Event
                </span>
                {status === 'ongoing' && (
                  <span className="flex items-center gap-2 text-[#FF8D1D] text-xs font-bold uppercase tracking-wider animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8D1D] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8D1D]"></span>
                    </span>
                    Live Voting
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-2">
                {electionDetail.name || 'Memuat Data...'}
              </h1>
              <p className="text-gray-500 max-w-2xl text-lg">
                {electionDetail.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <LuCalendarDays className="text-[#FF8D1D]" />
                <span>Mulai: <span className="text-black font-bold">{dateFormat(startTime)}</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <LuClock className="text-[#FF8D1D]" />
                <span>Selesai: <span className="text-black font-bold">{dateFormat(endTime)}</span></span>
              </div>
            </div>
          </div>
        </div>

        {status === 'init' ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200'>
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <LuClock size={40} className="text-gray-400" />
            </div>
            <h2 className='text-2xl font-bold text-gray-800'>Pemilihan Belum Dimulai</h2>
            <p className='text-gray-500'>Silakan kembali pada waktu yang ditentukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((candidate, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-72 w-full overflow-hidden bg-gray-200">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMG}/${candidate.imgHash}`}
                    alt={candidate.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black tracking-tighter shadow-sm border border-white/20">
                    Candidate #{index + 1}
                  </div>

                  <div className="absolute top-4 right-4 bg-[#FF8D1D] text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF8D1D]/20 transform transition-transform group-hover:scale-110">
                    <LuUsers size={14} className="fill-black/10" />
                    <span>{candidate.voteCount} Suara</span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                    {candidate.name}
                  </h3>

                  {/*<div className="w-full bg-gray-100 h-1.5 rounded-full mb-4 overflow-hidden">*/}
                  {/*  <div*/}
                  {/*    className="bg-[#FF8D1D] h-full rounded-full transition-all duration-1000 ease-out"*/}
                  {/*    style={{ width: `${Math.min(parseInt(candidate.voteCount) * 2, 100)}%` }} // Visual saja, logic persentase asli butuh total vote*/}
                  {/*  ></div>*/}
                  {/*</div>*/}

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-8 h-[60px] overflow-scroll">
                    {candidate.description}
                  </p>

                  {status === 'ongoing' ? (
                    <button
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setShowModal(true);
                      }}
                      className="w-full bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#FF8D1D] group-hover:text-black transition-colors duration-300 shadow-xl shadow-transparent group-hover:shadow-[#FF8D1D]/20"
                    >
                      <LuVote size={20} />
                      Pilih Kandidat
                    </button>
                  ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed border border-gray-200">
                      Pemilihan Selesai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedCandidate && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-4'>
          <div className='bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl scale-in-center'>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#FF8D1D]/10 p-3 rounded-2xl text-[#FF8D1D]">
                <LuVote size={32} />
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black transition-colors">
                <LuX size={24} />
              </button>
            </div>

            <h2 className='text-3xl font-black mb-3'>Konfirmasi Pilihan</h2>
            <p className='text-gray-500 mb-8 leading-relaxed'>
              Anda akan memilih <span className="font-bold text-black">{selectedCandidate.name}</span>.
              Transaksi ini akan dicatat di blockchain dan tidak dapat diubah.
            </p>

            <div className='grid grid-cols-2 gap-4'>
              <button
                className='py-4 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors'
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className='py-4 rounded-xl font-bold bg-[#FF8D1D] hover:bg-[#ff9d3d] text-black shadow-lg shadow-[#FF8D1D]/20 flex items-center justify-center gap-2'
                onClick={() => handleVote(selectedCandidate.index)}
              >
                <LuCheck size={20} />
                Ya, Pilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}