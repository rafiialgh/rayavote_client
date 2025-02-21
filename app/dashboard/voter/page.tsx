'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../Navbar';
import { LuPlus } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { editVoter, getVoter } from '@/services/voter';
import TableRow from './TableRow';
import Cookies from 'js-cookie';
import { getElectionContract } from '@/utils/contract';

export default function Voter() {
  interface Voter {
    _id: string;
    email: string;
    name: string;
  }

  const [voters, setVoters] = useState<Voter[]>([]);
  const [editingVoter, setEditingVoter] = useState<Voter | null>(null);
  const [electionDetail, setElectionDetail] = useState({
      name: '',
      description: ''
    })

  const getVoterList = useCallback(async () => {
    try {
      const response = await getVoter();
      console.log(response.data);
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
      toast.error('Gagal memuat data voter');
    }
  }, [getVoter]);

  const getElectionDetail = useCallback(async () => {
    const address = Cookies.get('address');
    const Election = getElectionContract(address);
    const election = await Election!.getElectionDetails()
      setElectionDetail({
        name: election[0],
        description: election[1]
      })
  }, [])

  useEffect(() => {
    getVoterList();
    getElectionDetail();
  }, [getVoterList]);

  const handleRemoveVoter = (id: string) => {
    setVoters((prevVoters) => prevVoters.filter((voter) => voter._id !== id));
  };

  const openEditModal = (voter: Voter) => {
    setEditingVoter(voter);
  };

  const closeEditModal = () => {
    setEditingVoter(null);
  };

  const handleSave = async (updatedVoter: Voter) => {
      try {
        const response = await editVoter(updatedVoter._id, {email: updatedVoter.email, name: updatedVoter.name, electionName: electionDetail.name, electionDescription: electionDetail.description});
        console.log(response)
        if (!response.error) {
          toast.success(response.message);
          setVoters((prev) =>
            prev.map((c) => (c._id === updatedVoter._id ? updatedVoter : c))
          );
          closeEditModal();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        toast.error('Gagal memperbarui voter');
      }
    };

  return (
    <>
      <div>
        <div className='flex mb-3 justify-between items-center bg-white rounded-lg border border-gray-300'>
          <div className='ml-10'>
            <h1 className='text-black text-lg'>Voter List</h1>
          </div>
          <a
            href='/dashboard/voter/add'
            className='w-fit h-fit py-2 px-5 bg-green-500 hover:bg-green-600 transition-all rounded-lg flex items-center'
          >
            <span className='mr-3'>
              <LuPlus />
            </span>
            Add Voter
          </a>
        </div>
        <div className='relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border border border-gray-300'>
          <table className='w-full text-left table-auto min-w-max'>
            <thead>
              <tr>
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
                    Action
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter) => (
                <TableRow
                  key={voter._id}
                  {...voter}
                  onRemove={handleRemoveVoter}
                  onEdit={openEditModal}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingVoter && (
        <EditModal
          voter={editingVoter}
          onClose={closeEditModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}

const EditModal = ({ voter, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });

  useEffect(() => {
    if (voter) {
      setFormData(voter);
    }
  }, [voter]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { email, name } = formData;
    if (!email || !name) {
      toast.warning('Pastikan semua field bertanda (*) sudah diisi.');
      return;
    }

    await onSave(formData);
    onClose();
  };

  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-28">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Voter</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg font-sans"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg font-sans"
            />
          </div>

          {/* <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              New password
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='New password (Optional)'
              className="w-full px-3 py-2 border rounded-lg font-sans"
            />
          </div> */}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}