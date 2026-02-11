'use client';
import { addImageCandidate } from '@/services/candidate';
import { getElectionContract } from '@/utils/contract';
import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LuArrowLeft, 
  LuUser, 
  LuMail, 
  LuFileText, 
  LuImagePlus, 
  LuLoader, 
  LuX, 
  LuCheck
} from 'react-icons/lu';
import Image from 'next/image';

function AddCandidateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formDatas, setFormDatas] = useState<{
    name: string;
    email: string;
    description: string;
    avatar: File | null;
  }>({
    name: '',
    email: '',
    description: '',
    avatar: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDatas({
      ...formDatas,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        toast.warning('Ukuran gambar maksimal 2MB');
        return;
      }

      setFormDatas({
        ...formDatas,
        avatar: file,
      });
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const clearImage = () => {
    setFormDatas({ ...formDatas, avatar: null });
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description, avatar, email } = formDatas;
    if (!name || !description || !avatar || !email) {
      toast.warning('Harap lengkapi semua field yang bertanda (*).');
      return;
    }

    try {
      setIsLoading(true);
      
      const data = new FormData();
      data.set('avatar', avatar);

      const response = await addImageCandidate(data);

      if (response.error) {
        toast.error(response.message);
        setIsLoading(false);
        return;
      } 
      
      try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const address = Cookies.get('address');
          if(!address) throw new Error("Contract address not found");
          
          const Election = getElectionContract(address);
          if (!Election) {
            toast.error('Gagal menghubungkan ke Smart Contract.');
            setIsLoading(false);
            return;
          }

          const imageName = `${response.display_name}.${response.format}`;

          const tx = await Election.addCandidate(
            name,
            description,
            imageName,
            email
          );

          console.log(`Transaction Hash: ${tx.hash}`);
          await tx.wait(); 

          toast.success('Kandidat berhasil ditambahkan ke Blockchain!');
          
          setFormDatas({
            name: '',
            description: '',
            email: '',
            avatar: null,
          });
          setImagePreview(null);
          
          // router.push('/dashboard/candidate');

      } catch (error: any) {
          console.error(error);
          if (error.code === 4001) {
             toast.warning('Transaksi dibatalkan oleh user.');
          } else {
             toast.error('Gagal menambahkan kandidat ke blockchain.');
          }
      }

    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan pada server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-[#222222] pt-28 pb-10 px-4">
      
      {isLoading && (
        <div className='fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]'>
          <LuLoader className='animate-spin text-[#FF8D1D] mb-4' size={50} />
          <h3 className='text-xl font-black tracking-tight uppercase'>Menyimpan Data</h3>
          <p className='text-gray-500 text-sm mt-2'>Mengupload gambar & mencatat di Blockchain...</p>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link href="/dashboard/candidate">
                <button className="flex items-center text-gray-500 hover:text-black transition-colors mb-4 font-bold text-sm">
                    <LuArrowLeft className="mr-2" /> Back to List
                </button>
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">Add New Candidate</h1>
            <p className="text-gray-500 mt-2">Register a new candidate profile to the decentralized voting system.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="space-y-4">
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">
                        Candidate Photo *
                    </label>
                    
                    {!imagePreview ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF8D1D] hover:bg-[#FF8D1D]/5 transition-all group"
                        >
                            <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-white group-hover:text-[#FF8D1D] transition-colors">
                                <LuImagePlus size={32} className="text-gray-400 group-hover:text-[#FF8D1D]" />
                            </div>
                            <p className="text-sm font-bold text-gray-700">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (Max 2MB)</p>
                        </div>
                    ) : (
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden group border border-gray-200">
                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={clearImage}
                                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
                                >
                                    <LuX /> Remove Image
                                </button>
                            </div>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">Full Name *</label>
                        <div className="relative group">
                            <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors" size={20} />
                            <input
                                type="text"
                                name="name"
                                value={formDatas.name}
                                onChange={handleChange}
                                placeholder="Ex: John Doe"
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
                                value={formDatas.email}
                                onChange={handleChange}
                                placeholder="candidate@email.com"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all font-bold text-gray-900"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-wider">Vision & Mission *</label>
                    <div className="relative group">
                        <LuFileText className="absolute left-4 top-6 text-gray-400 group-focus-within:text-[#FF8D1D] transition-colors" size={20} />
                        <textarea
                            name="description"
                            value={formDatas.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Describe the candidate's background, vision, and mission..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8D1D]/20 focus:border-[#FF8D1D] outline-none transition-all font-medium text-gray-700 resize-none"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF8D1D] hover:bg-[#ff9d3d] disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-extrabold py-5 rounded-xl shadow-lg shadow-[#FF8D1D]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            'Processing Transaction...'
                        ) : (
                            <>
                                <LuCheck size={22} />
                                Confirm & Add Candidate
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        By clicking confirm, you are initiating a transaction on the Ethereum network. Gas fees may apply.
                    </p>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}

export default AddCandidateForm;