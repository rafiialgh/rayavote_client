import { deleteVoter } from '@/services/voter';
import React from 'react';
import { LuDelete, LuPencil, LuTrash } from 'react-icons/lu';
import { toast } from 'react-toastify';

export default function TableRow(props: any) {
  const { _id, email, name, password, onRemove, onEdit } = props;

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      'Apakah Anda yakin ingin menghapus kandidat ini?'
    );
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
            {name}
          </p>
        </td>
        <td className='p-4 border-b border-blue-gray-50'>
          <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
            {email}
          </p>
        </td>

        <td className='p-4 border-b border-blue-gray-50 flex gap-3'>
          <button
            onClick={() =>
              onEdit({
                _id,
                email,
                name,
              })
            }
            className='flex justify-center items-center font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900 w-20 p-2 bg-yellow-400 rounded-lg text-center'
          >
            <span className='mr-3'>
              <LuPencil />
            </span>
            Edit
          </button>
          <button
            className=' font-sans text-sm antialiased font-medium leading-normal flex justify-center items-center text-white w-20 p-2 bg-red-500 rounded-lg text-center'
            onClick={() => handleDelete(_id)}
          >
            <span className='mr-3'>
              <LuTrash />
            </span>
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}
