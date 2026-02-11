import React from 'react';
import { toast } from 'react-toastify';
import { deleteCandidate } from '@/services/candidate';
import { LuTrash2, LuPencil } from 'react-icons/lu';
import Image from 'next/image';

function TableRow(props: any) {
  const {
    _id,
    name,
    email,
    voteCount,
    imgHash,
    description,
    onRemove, 
    onEdit    
  } = props;

  const handleDelete = async (id: string) => {
    if(!onRemove) return; 

    const confirm = window.confirm('Are you sure you want to delete this candidate?');
    if (!confirm) return;

    try {
      const response = await deleteCandidate(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Candidate deleted successfully');
        onRemove(id);
      }
    } catch (error) {
      toast.error('Error deleting candidate');
    }
  };

  return (
    <tr className="group hover:bg-slate-50 transition-colors duration-200">
      <td className='p-6 align-middle'>
        <div className='w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
            <Image 
                src={`${process.env.NEXT_PUBLIC_IMG}/${imgHash}`} 
                alt={name} 
                width={56}
                height={56}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + name + '&background=random';
                }}
            />
        </div>
      </td>

      <td className='p-6 align-middle'>
        <p className='font-bold text-gray-900 text-base mb-0.5'>
          {name}
        </p>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Candidate</span>
      </td>

      <td className='p-6 align-middle'>
        <div className="flex items-center gap-2">
            <p className='text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg'>
            {email}
            </p>
        </div>
      </td>

      <td className='p-6 align-middle max-w-xs'>
        <p className='text-sm text-gray-500 line-clamp-2 leading-relaxed'>
          {description}
        </p>
      </td>

      <td className='p-6 align-middle text-center'>
        <div className="inline-flex flex-col items-center justify-center bg-[#FF8D1D]/10 text-[#FF8D1D] px-4 py-2 rounded-xl min-w-[60px]">
             <span className="text-lg font-black">{voteCount}</span>
             <span className="text-[10px] font-bold uppercase tracking-wider">Votes</span>
        </div>
      </td>

      {/* <td className='p-6 align-middle text-right'>
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => onEdit && onEdit(props)}
                className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                title="Edit Details"
            >
                <LuPencil size={18} />
            </button>
            <button
                onClick={() => handleDelete(_id)}
                className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                title="Delete Candidate"
            >
                <LuTrash2 size={18} />
            </button>
        </div>
      </td> 
      */}
    </tr>
  );
}

export default TableRow;