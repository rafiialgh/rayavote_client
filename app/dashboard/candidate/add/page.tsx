'use client';
import { addCandidate, addImageCandidate } from '@/services/candidate';
import { getElectionContract, getElectionFactContract } from '@/utils/contract';
import { Darumadrop_One } from 'next/font/google';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function AddCandidateForm() {
  const [isLoading, setIsLoading] = useState(false)
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
      setFormDatas({
        ...formDatas,
        avatar: e.target.files[0], // Simpan file gambar ke state
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description, avatar, email } = formDatas;
    if (!name || !description || !avatar || !email) {
      toast.warning('Pastikan semua field bertanda (*) sudah diisi.');
      return;
    }
    const data = new FormData();
    data.set('avatar', formDatas.avatar ?? '');

    try {
      setIsLoading(true)
      const response = await addImageCandidate(data);
      console.log(response.avatar);

      if (response.error) {
        toast.error(response.message);
      } else {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const address = Cookies.get('address');
          const Election = getElectionContract(address);
          console.log(Election);
          if (!Election) {
            toast.error('Failed to get election contract.');
            return;
          }

          const tx = await Election.addCandidate(
            formDatas.name,
            formDatas.description,
            response.avatar,
            formDatas.email
          );

          console.log(`Loading - ${tx}`);
          await tx.wait();
          setIsLoading(false)
          if (tx) {
            const numOfCanidate = await Election.getNumOfCandidates();
            console.log(numOfCanidate);
            const [
              candidate_name,
              candidate_description,
              imgHash,
              voteCount,
              email,
            ] = await Election.getCandidate(1);
            console.log(candidate_name);
            console.log(candidate_description);
            console.log(imgHash);
            console.log(voteCount);
            console.log(email);
          }
        } catch (error) {
          console.error(error);
          toast.error('Terjadi kesalahan saat add candidate.');
        }
        setFormDatas({
          name: '',
          description: '',
          email: '',
          avatar: null,
        });
        toast.success('Menambahkan candidate Berhasil!');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan pada server!');
    }
  };

  return (
    <>
    {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-5 rounded-md shadow-lg'>
            <p className='text-lg font-semibold'>Adding Candidate...</p>
          </div>
        </div>
      )}
      <div className='flex justify-center items-center'>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-6 rounded shadow-md w-full max-w-md'
          encType='multipart/form-data'
        >
          <h2 className='text-2xl font-bold mb-4'>Add Candidate</h2>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Name *
            </label>
            <input
              type='text'
              name='name'
              value={formDatas.name}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Email *
            </label>
            <input
              type='email'
              name='email'
              value={formDatas.email}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Description *
            </label>
            <textarea
              name='description'
              value={formDatas.description}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Upload Image *
            </label>
            <input
              type='file'
              name='avatar'
              onChange={handleImageChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
              accept='image/*'
            />
          </div>

          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Add Candidate
          </button>
        </form>
      </div>
    </>
  );
}

export default AddCandidateForm;
