'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { 
  LuPlus, 
  LuSearch, 
  LuFilter, 
  LuUserX, 
  LuPencil, 
  LuTrash2, 
  LuCheck,
  LuX,
  LuLoader
} from 'react-icons/lu';
import { toast } from 'react-toastify';
import { editVoter, getVoter, deleteVoter } from '@/services/voter';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';
import Link from 'next/link';

export default function VoterPage() {
  interface Voter {
    _id: string;
    email: string;
    name: string;
  }

  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [electionDetail, setElectionDetail] = useState({
      name: '',
      description: ''
  });

  const getVoterList = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getVoter();
      if (!response.error) {
        const votersData = response.data.map((voter: any) => ({
          _id: voter._id,
          email: voter.email,
          name: voter.name,
        }));
        setVoters(votersData);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to load voter list');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getElectionDetail = useCallback(async () => {
    const address = Cookies.get('address');
    if(address){
        try {
            const Election = getElectionContract(address);
            if(Election) {
                const election = await Election.getElectionDetails()
                setElectionDetail({
                    name: election[0],
                    description: election[1]
                })
            }
        } catch(e) { console.error(e) }
    }
  }, [])

  useEffect(() => {
    getVoterList();
    getElectionDetail();
  }, [getVoterList, getElectionDetail]);

  const handleRemoveVoter = async (id: string) => {
    if(!window.confirm('Are you sure you want to delete this voter?')) return;

    try {
        const response = await deleteVoter(id);
        if(!response.error){
            setVoters((prev) => prev.filter((v) => v._id !== id));
            toast.success('Voter deleted successfully');
        } else {
            toast.error(response.message);
        }
    } catch (e) {
        toast.error('Failed to delete voter');
    }
  };

  const handleSave = async (updatedVoter: Voter) => {
      try {
        const response = await editVoter(updatedVoter._id, {
            email: updatedVoter.email, 
            name: updatedVoter.name, 
            electionName: electionDetail.name, 
            electionDescription: electionDetail.description
        });
        
        if (!response.error) {
          toast.success('Voter updated successfully');
          setVoters((prev) =>
            prev.map((c) => (c._id === updatedVoter._id ? updatedVoter : c))
          );
          setEditingVoter(null);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('Failed to update voter');
      }
  };

  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222]">
      <Navbar />

      <div className="pt-28 pb-10 px-6 max-w-[1280px] mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
                    Voter Management
                </h1>
                <p className="text-gray-500">
                    Manage the list of eligible voters for your election.
                </p>
            </div>
            
            <Link href='/dashboard/voter/add'>
                <button className='flex items-center gap-2 bg-black hover:bg-[#FF8D1D] hover:text-black text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[#FF8D1D]/20 active:scale-95'>
                    <LuPlus size={20} />
                    <span>Register Voter</span>
                </button>
            </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96 group">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search voter name or email..." 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="hidden md:block">
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 text-gray-500 rounded-xl font-bold text-sm">
                    <LuFilter /> Filter
                </button>
             </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Voter Name</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                    <td className="p-6"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                    <td className="p-6"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                                    <td className="p-6 text-right"><div className="h-8 w-20 bg-gray-200 rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : filteredVoters.length > 0 ? (
                            filteredVoters.map((voter) => (
                                <tr key={voter._id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="p-6 font-bold text-gray-900 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                                {voter.name.charAt(0)}
                                            </div>
                                            {voter.name}
                                        </div>
                                    </td>
                                    <td className="p-6 text-gray-600 font-medium align-middle">{voter.email}</td>
                                    <td className="p-6 align-middle">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                                            <LuCheck size={12}/> Eligible
                                        </span>
                                    </td>
                                    <td className="p-6 text-right align-middle">
                                        <div className="flex items-center justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setEditingVoter(voter)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Voter"
                                            >
                                                <LuPencil size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleRemoveVoter(voter._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove Voter"
                                            >
                                                <LuTrash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                                            <LuUserX size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-600">No Voters Found</h3>
                                        <p className="text-sm">Try adding a new voter to the list.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>

      {editingVoter && (
        <EditModal
          voter={editingVoter}
          onClose={() => setEditingVoter(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const EditModal = ({ voter, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (voter) setFormData(voter);
  }, [voter]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.email || !formData.name) {
      toast.warning('Please fill in all required fields.');
      return;
    }
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden scale-in-center">
        
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black text-gray-900">Edit Voter Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                <LuX size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none font-bold"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl font-bold text-black bg-[#FF8D1D] hover:bg-[#ff9d3d] transition-colors shadow-lg shadow-[#FF8D1D]/20 flex items-center justify-center gap-2"
            >
              {isSaving ? <LuLoader className="animate-spin"/> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};