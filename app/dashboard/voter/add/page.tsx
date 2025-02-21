'use client';
import { addVoter } from '@/services/voter';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';

function AddCandidateForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [electionDetail, setElectionDetail] = useState({
        name: '',
        description: ''
      })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getElectionDetail = useCallback(async () => {
    const address = Cookies.get('address');
    const Election = getElectionContract(address);
    const election = await Election!.getElectionDetails()
      setElectionDetail({
        name: election[0],
        description: election[1]
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const address = Cookies.get('address')

    if (!address) {
      toast.error('Address tidak ditemukan di cookies!');
      return;
    }

    const { name, email } = formData;

    if (!name || !email) {
      toast.warning('Pastikan semua field bertanda (*) sudah diisi.');
      return;
    }

    // try {
    //   const response = await addVoter({
    //     email,
    //     password,
    //     electionAddress: address,
    //     electionName: electionDetail.name,
    //     electionDescription: electionDetail.description
    //   });
    //   console.log(response);

    //   if (response.error) {
    //     toast.error(response.message);
    //   } else {
    //     setFormData({
    //       email: '',
    //       password: '',
    //     });
    //     toast.success(response.data.message);
    //   }
    // } catch (error) {
    //   console.log(error)
    //   toast.error('Terjadi kesalahan pada server!');
    // }

    const response = await addVoter({
      name,
      email,
      electionAddress: address,
      electionName: electionDetail.name,
      electionDescription: electionDetail.description
    });

    
    if (response.error) {
      console.log(response)
      toast.error(response.message);
    } else {
      setFormData({ name: '', email: '' });
      toast.success(response.message);
    }
  
    
    
  };

  useEffect(() => {
    getElectionDetail()
  }, [])

  return (
    <div className='flex justify-center items-center'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded shadow-md w-full max-w-md'
      >
        <h2 className='text-2xl font-bold mb-4'>Add Voter</h2>

        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>Name *</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-lg font-sans'
            placeholder='Contoh: Rafii Alghafary'
          />
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-2'>
            Email *
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-lg font-sans'
            placeholder='Contoh: vote@gmail.com'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          Add Voter
        </button>
      </form>
    </div>
  );
}

export default AddCandidateForm;
