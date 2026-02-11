'use client';
import { addVoter } from '@/services/voter';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';
import Link from 'next/link';
import { 
  LuArrowLeft, 
  LuUser, 
  LuMail, 
  LuLoader, 
  LuCheck,
  LuShieldCheck 
} from 'react-icons/lu';
import { useRouter } from 'next/navigation';

function AddVoter() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [electionDetail, setElectionDetail] = useState({
    name: '',
    description: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getElectionDetail = useCallback(async () => {
    const address = Cookies.get('address');
    if (!address) return;

    try {
      const Election = getElectionContract(address);
      if (Election) {
        const election = await Election.getElectionDetails();
        setElectionDetail({
          name: election[0],
          description: election[1]
        });
      }
    } catch (error) {
      console.error("Failed to fetch election details", error);
    }
  }, []);

  useEffect(() => {
    getElectionDetail();
  }, [getElectionDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const address = Cookies.get('address');

    if (!address) {
      toast.error('Election address not found. Please select an election.');
      setIsLoading(false);
      return;
    }

    const { name, email } = formData;

    if (!name || !email) {
      toast.warning('Please fill in all required fields (*).');
      setIsLoading(false);
      return;
    }

    try {
      const response = await addVoter({
        name,
        email,
        electionAddress: address,
        electionName: electionDetail.name,
        electionDescription: electionDetail.description
      });
      
      if (response.error) {
        toast.error(response.message);
      } else {
        setFormData({ name: '', email: '' });
        toast.success(response.message || 'Voter added successfully!');

        // router.push('/dashboard/voter');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222] pt-28 pb-10 px-4">
      
      {isLoading && (
        <div className='fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]'>
          <LuLoader className='animate-spin text-[#FF8D1D] mb-4' size={50} />
          <h3 className='text-xl font-black tracking-tight uppercase'>Registering Voter</h3>
          <p className='text-gray-500 text-sm mt-2'>Generating access token & updating database...</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        
        <div className="mb-8">
            <Link href="/dashboard/voter">
                <button className="flex items-center text-gray-500 hover:text-black transition-colors mb-4 font-bold text-sm">
                    <LuArrowLeft className="mr-2" /> Back to Voter List
                </button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Add New Voter</h1>
            <p className="text-gray-500 mt-2">
                Register an eligible voter for <span className="font-bold text-black">{electionDetail.name || 'the current election'}</span>.
            </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
            
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-3 items-start">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                    <LuShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Secure Registration</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        The system will automatically generate a unique access token for this voter. 
                        They will need this token to access the voting booth.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">Full Name *</label>
                    <div className="relative group">
                        <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors" size={20} />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Rafii Alghafary"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all font-bold text-gray-900"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">Email Address *</label>
                    <div className="relative group">
                        <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors" size={20} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Ex: vote@gmail.com"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all font-bold text-gray-900"
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF8D1D] hover:bg-[#ff9d3d] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-extrabold py-5 rounded-xl shadow-lg shadow-[#FF8D1D]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            'Processing...'
                        ) : (
                            <>
                                <LuCheck size={22} />
                                Register Voter
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}

export default AddVoter;