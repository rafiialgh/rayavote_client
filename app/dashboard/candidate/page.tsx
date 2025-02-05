'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { LuPlus } from 'react-icons/lu';
import { getCandidate, editCandidate } from '@/services/candidate';
import TableRow from './TableRow';
import { toast } from 'react-toastify';
import { getElectionContract } from '@/utils/contract';

export default function Candidate() {
  interface Candidate {
    name: string;
    email: string;
    description: string;
    imgHash: string;
  }

  // const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidates, setCandidates] = useState<any>([]);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(
    null
  );

  // const getCandidateList = useCallback(async () => {
  //   try {
  //     const response = await getCandidate();
  //     if (!response.error) {
  //       setCandidates(response.data);
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error('Gagal memuat data kandidat');
  //   }
  // }, [getCandidate]);

  useEffect(() => {
    const fetchData = async () => {
      // await getCandidateList();

      const address = Cookies.get('address');
      const Election = getElectionContract(address);
      console.log(Election);
      if (!Election) {
        toast.error('Failed to get election contract.');
        return;
      }

      // Get the number of candidates
      const numOfCandidates = await Election.getNumOfCandidates();
      console.log('Number of candidates:', numOfCandidates);

      // Fetch data for all candidates concurrently
      const candidatesData = await Promise.all(
        Array.from({ length: numOfCandidates }, (_, index) => 
          Election.getCandidate(index)
        )
      );

      // Map the fetched data to a structured format and update state
      const formattedCandidates = candidatesData.map(candidate => ({
        name: candidate[0],
        description: candidate[1],
        imgHash: candidate[2],
        voteCount: candidate[3],
        email: candidate[4],
      }));

      // Update state with all candidates data
      setCandidates(formattedCandidates);
    };

    fetchData();
    // getCandidateList();
  }, []);

  // const handleRemoveCandidate = (id: string) => {
  //   setCandidates((prevCandidates) =>
  //     prevCandidates.filter((candidate) => candidate._id !== id)
  //   );
  // };

  const openEditModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
  };

  const closeEditModal = () => {
    setEditingCandidate(null);
  };

  // const handleSave = async (updatedCandidate: Candidate) => {
  //   try {
  //     const response = await editCandidate(
  //       updatedCandidate._id,
  //       updatedCandidate
  //     );
  //     if (!response.error) {
  //       toast.success(response.message);
  //       setCandidates((prev) =>
  //         prev.map((c) =>
  //           c._id === updatedCandidate._id ? updatedCandidate : c
  //         )
  //       );
  //       closeEditModal();
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error('Gagal memperbarui kandidat');
  //   }
  // };

  return (
    <>
      <div>
        <div className='flex mb-3 justify-between items-center bg-white rounded-lg border border-gray-300'>
          <div className='ml-10'>
            <h1 className='text-black text-lg'>Candidate List</h1>
          </div>
          <a
            href='/dashboard/candidate/add'
            className='w-fit h-fit py-2 px-5 bg-green-500 hover:bg-green-600 transition-all rounded-lg flex items-center'
          >
            <span className='mr-3'>
              <LuPlus />
            </span>
            Add candidate
          </a>
        </div>
        <div className='relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border border-gray-300'>
          <table className='w-full text-left table-auto min-w-max'>
            <thead>
              <tr>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Image
                  </p>
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Name
                  </p>
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Email
                  </p>
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Description
                  </p>
                </th>
                <th className='p-4 border-b border-blue-gray-100 bg-blue-gray-50'>
                  <p className='block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70'>
                    Vote Count
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate: any, index: any) => (
                <TableRow
                  key={index}
                  {...candidate}
                  // onRemove={handleRemoveCandidate}
                  onEdit={openEditModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingCandidate && (
        <EditModal
          candidate={editingCandidate}
          onClose={closeEditModal}
          // onSave={handleSave}
        />
      )}
    </>
  );
}

const EditModal = ({ candidate, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    degree: '',
    description: '',
  });

  useEffect(() => {
    if (candidate) {
      setFormData(candidate);
    }
  }, [candidate]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { username, firstName, dateOfBirth, degree, description } = formData;
    if (!username || !firstName || !dateOfBirth || !degree || !description) {
      toast.warning('Pastikan semua field bertanda (*) sudah diisi.');
      return;
    }

    await onSave(formData);
    onClose();
  };

  return (
    <div className='modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-28'>
      <div className='bg-white p-6 rounded shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Edit Candidate</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Username *
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              First Name *
            </label>
            <input
              type='text'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Last Name
            </label>
            <input
              type='text'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Date of Birth *
            </label>
            <input
              type='date'
              name='dateOfBirth'
              value={formatDate(formData.dateOfBirth)}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 font-medium mb-2'>
              Degree *
            </label>
            <input
              type='text'
              name='degree'
              value={formData.degree}
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
              value={formData.description}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg font-sans'
            />
          </div>

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
