import { deleteVoter } from '@/services/voter';
import React from 'react';
import { toast } from 'react-toastify';

export default function TableRow(props: any) {
  const {_id, email, password, onRemove, onEdit} = props

  const handleDelete = async (id: string) => {
        const confirm = window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?');
        if (!confirm) return;
      
        try {
          const response = await deleteVoter(id);
      
          if (response.error) {
            toast.error(response.error);
          } else {
            toast.success('Candidate berhasil dihapus');
            onRemove(id);
          }
        } catch (error) {
          toast.error('Terjadi kesalahan saat menghapus candidate');
        }
      };

  return (
    <>
      <tr>
        <td className='p-4 border-b border-blue-gray-50'>
          <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
            {email}
          </p>
        </td>
        <td className='p-4 border-b border-blue-gray-50'>
          <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
            {password}
          </p>
        </td>
        
        <td className='p-4 border-b border-blue-gray-50 flex gap-3'>
          <button
            onClick={() =>
              onEdit({
                _id,
                email,
                password
              })
            }
            className='block font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900 w-20 p-2 bg-yellow-400 rounded-lg text-center'
          >
            Edit
          </button>
          <button
            className='block font-sans text-sm antialiased font-medium leading-normal text-white w-20 p-2 bg-red-500 rounded-lg text-center'
            onClick={() => handleDelete(_id)}
          >
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}
