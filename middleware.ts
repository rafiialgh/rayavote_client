import { NextResponse } from 'next/server';

import { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const tokenVoter = req.cookies.get('tokenVoter');

  // Daftar rute yang butuh login
  const protectedRoutes = ['/dashboard'];
  const protectedRoutesVoter = ['/voting'];

  // company
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login/company', req.url));
  }

  // // voter
  if (
    protectedRoutesVoter.some((route) => req.nextUrl.pathname.startsWith(route)) &&
    !tokenVoter
  ) {
    return NextResponse.redirect(new URL('/login/voter', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/dashboard/:path*', '/voting/:path*'], // Tentukan rute yang diproteksi
};
