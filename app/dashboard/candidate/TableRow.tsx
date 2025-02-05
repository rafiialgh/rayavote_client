import { deleteCandidate } from '@/services/candidate';
import React from 'react';
import { toast } from 'react-toastify';

function TableRow(props: any) {
  const {_id, username, name, firstName, email, lastName, voteCount, dateOfBirth, degree, imgHash, description, onRemove, onEdit} = props

  const formattedDate = new Date(dateOfBirth).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = async (id: string) => {
      const confirm = window.confirm('Apakah Anda yakin ingin menghapus kandidat ini?');
      if (!confirm) return;
    
      try {
        const response = await deleteCandidate(id);
    
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
    <tr>
      <td className='p-4 border-b border-blue-gray-50'>
        <div className='w-10 h-10'>
        <img src={`${process.env.NEXT_PUBLIC_IMG}/${imgHash}`} alt="" width='auto' height='auto'/>

        </div>
        {/* <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
          {process.env.NEXT_PUBLIC_IMG}/{imgHash}
        </p> */}
      </td>
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
      <td className='p-4 border-b border-blue-gray-50'>
        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
          {description}
        </p>
      </td>
      <td className='p-4 border-b border-blue-gray-50'>
        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
          {voteCount}
        </p>
      </td>
      {/* <td className='p-4 border-b border-blue-gray-50'>
        <p className='block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900'>
          {formattedDate}
        </p>
      </td> */}
      {/* <td className='p-4 border-b border-blue-gray-50 flex gap-3'>
        <button
          onClick={() => onEdit({ _id, username, firstName, lastName, dateOfBirth, degree, description })}
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
      </td> */}
    </tr>
  );
}

export default TableRow;
