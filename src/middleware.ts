import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { CustomUser } from './app/api/auth/[...nextauth]/options';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req });
  // get usr from token
  const user: CustomUser | null = token?.user as CustomUser;

  if (pathname === '/login' || pathname === '/admin/login') {
    if (user?.role === 'user')
      return NextResponse.redirect(new URL('/', req.url));
    if (user?.role === 'admin')
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));

    return NextResponse.next();
  }

  // protected routes for user
  const userProtectedRoutesForUser = ['/'];

  // protected routes for user
  const userProtectedRoutesForAdmin = ['/admin/dashboard'];

  if (!token && userProtectedRoutesForUser.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (!token && userProtectedRoutesForAdmin.includes(pathname)) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // check user's role
  if (
    userProtectedRoutesForAdmin.includes(pathname) &&
    user?.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (userProtectedRoutesForUser.includes(pathname) && user?.role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }
}
