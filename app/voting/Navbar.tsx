import React from 'react';
import logo from '@/public/img/logo.svg';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

function Navbar(props: any) {
  const router = useRouter();

  const logout = () => {
    Cookies.remove('address');
    Cookies.remove('emailVoter');
    Cookies.remove('tokenVoter');

    router.push('/login/voter');
  };

  return (
    <nav
      className={
        'w-full z-50 transition-transform duration-300 flex justify-center'
      }
    >
      <div
        className={
          'w-[90%] top-0 bg-black h-20 mx-4 mt-4 md:m-10 items-center flex rounded-lg'
        }
      >
        <div className='flex w-full mx-10 items-center justify-between'>
          {/* Logo */}
          <Image src={logo} width={40} height={50} alt='logo' />

          <div className='flex'>
            <div className='py-1 px-7 rounded-lg bg-white'>
              <p>{props.user}</p>
            </div>
          {/* Logout Button */}
          <button
              onClick={logout}
              className='text-white py-1 px-7 rounded-lg bg-red-600 ml-4'
            >
              Logout
            </button>
          </div>
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
