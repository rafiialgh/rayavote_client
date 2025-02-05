'use client'
import Image from 'next/image';
import Star from '/public/img/star1.png';
import { LuArrowUpRight } from 'react-icons/lu';
import { Navbar } from '@/components/Navbar';
import { useEffect } from 'react';
import axios from 'axios'

export default function Home() {

  useEffect(() => {
    // const test = async () => {
    //   const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/auth/test`)
    //   const result = response.data
    //   console.log(result)
    // }

    // test()
  },[])

  return (
    <>
      <Navbar />
      <div className='relative max-w-[1280px] mx-auto flex items-center justify-center overflow-hidden'>
        <div className='absolute -top-0 bg-grid-pattern bg-repeat bg-cover bg-top w-full mx-auto h-screen inset-0 -z-50'></div>
        <div className='mt-36 md:mt-48  mb-10 container flex items-center flex-col justify-center'>
          <h1 className='md:leading-[6.5rem] leading-[3.5rem] relative text-center text-4xl md:text-7xl'>
            <span>
              <img
                src='/img/star1.png'
                alt=''
                className='absolute w-[40px] md:w-[70px] -left-12 md:-left-20'
              />
            </span>
            <span>
              <img
                src='/img/star1.png'
                alt=''
                className='absolute w-[40px] md:w-[70px] -right-11 bottom-0 md:-right-20 md:bottom-0'
              />
            </span>
            <span className='bg-[#FF8D1D] w-full h-[3rem] md:h-[5.5rem] mt-1 md:mt-2 absolute -z-10 -left-0.5 md:-left-1 -rotate-2'></span>
            {/* <span><Image src={Star} width={50} height={50} alt="star" /></span> */}
            <span className='text-[#222222]'>
              Every Vote Counts,
              <br />
            </span>
            <span>Every Voice Matters</span>
          </h1>
          <h2 className='mt-2 text-xl md:text-4xl justify-center items-center text-center block md:inline'>
            <span className='block md:inline'>Make your vote count,</span>{' '}
            <span className='block md:inline'></span>secured by blockchain technology!
          </h2>
          <div className=' mt-7 w-full mx-10'>
            <ul className='flex justify-center gap-7 text-[#222222]'>
              <li className='w-[35%] md:w-[15%]'>
                <a
                  href='/login/voter'
                  className='w-full py-2 px-3 rounded-lg border bg-white flex items-center justify-between border-black hover:bg-gray-100 transition'
                >
                  Voter{' '}
                  <span className='ml-2'>
                    <LuArrowUpRight />
                  </span>
                </a>
              </li>
              <li className='w-[35%] md:w-[15%]'>
                <a
                  href='/login/company'
                  className='w-full py-2 px-3 rounded-lg border bg-[#FF8D1D] flex items-center justify-between border-black hover:bg-[#FF9E3D] transition'
                >
                  Company{' '}
                  <span className='ml-2'>
                    <LuArrowUpRight />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className='border-b border-stone-300' />
      <div className='h-fit max-w-[1280px] flex flex-col justify-center mx-14 my-10 md:px-10 md:mx-auto'>
        <div className='flex flex-col md:flex-row md:gap-5 justify-center'>
          <div className='w-fit h-fit md:50%'>
            <div className='grid grid-cols-2 gap-2'>
              <div className='max-w-20 max-h-20 md:max-w-36 md:max-h-36 border rounded-tl-[25px] bg-gray-400 overflow-hidden group'>
                <img
                  src='/img/profile1.png'
                  alt='profile1'
                  className='object-cover h-full w-full transition-transform duration-300 ease-in-out group-hover:scale-110'
                />
              </div>
              <div className='max-w-20 max-h-20 md:max-w-36 md:max-h-36 border rounded-tr-[25px] bg-gray-400 overflow-hidden group'>
                <Image
                  src='/img/profile2.png'
                  alt='profile2'
                  width={100}
                  height={100}
                  className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3'
                />
              </div>

              {/* Gambar 3 */}
              <div className='max-w-20 max-h-20 md:max-w-36 md:max-h-36 border rounded-bl-[25px] bg-gray-400 overflow-hidden group'>
                <Image
                  src='/img/profile3.png'
                  alt='profile3'
                  width={100}
                  height={100}
                  className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-[-3deg]'
                />
              </div>

              {/* Gambar 4 */}
              <div className='max-w-20 max-h-20 md:max-w-36 md:max-h-36 bg-gray-400 overflow-hidden group'>
                <Image
                  src='/img/profile4.png'
                  alt='profile4'
                  width={100}
                  height={100}
                  className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-1'
                />
              </div>
            </div>
          </div>
          <div className='md:w-[50%] flex flex-col justify-center'>
            <h1 className='text-3xl md:text-4xl mt-5'>Manage candidate</h1>
            <p className='font-sans md:text-lg text-pretty line-clamp-6'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo ipsa
              voluptatum ut quaerat alias soluta adipisci totam. At, hic a quas
              expedita reprehenderit rerum alias dignissimos? Veritatis delectus
              consectetur deserunt.
            </p>
          </div>
        </div>
        <div className='flex justify-center flex-col-reverse md:flex-row my-10 md:gap-5'>
          <div className='md:w-[50%] flex flex-col justify-center'>
            <h1 className='text-3xl md:text-4xl mt-5'>Voter registration</h1>
            <p className='font-sans md:text-lg text-pretty line-clamp-6'>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo ipsa
              voluptatum ut quaerat alias soluta adipisci totam. At, hic a quas
              expedita reprehenderit rerum alias dignissimos? Veritatis delectus
              consectetur deserunt.
            </p>
          </div>
          <div className='w-fit group'>
            <img
              src='/img/voter.png'
              alt=''
              className='hover:rotate-12 transition-transform group-hover:rotate-5 w-[296px]'
            />
          </div>
        </div>
      </div>
    </>
  );
}
