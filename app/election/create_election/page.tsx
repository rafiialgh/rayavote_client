import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { toast } from 'react-toastify';
import type { GetServerSideProps } from 'next';
import nookies from 'nookies'
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import CreateElection from './CreateElection';

export default function CreateElectionPage() {

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  // Redirect jika token tidak ditemukan
  if (!token) {
    redirect('/login/company');
  }

  return (
    <>
      <CreateElection />
    </>
  );
}