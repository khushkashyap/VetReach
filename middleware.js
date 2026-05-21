import { withAuth } from '@kinde-oss/kinde-auth-nextjs/middleware';
import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function middleware(req) {
  // Dev mode mein skip karo
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const { pathname } = req.nextUrl;

  // Not logged in — withAuth handle karega
  if (!user) {
    return withAuth(req);
  }

  // Role fetch karo apne backend se
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/kinde/${user.id}`,
  );
  const userData = await res.json();
  const role = userData?.role || 'reporter';

  // Role-based protection
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname.startsWith('/hospital') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (pathname.startsWith('/dashboard') && role === 'hospital') {
    return NextResponse.redirect(new URL('/hospital', req.url));
  }

  if (pathname.startsWith('/dashboard') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|about|discover|services|contact|_next/static|_next/image|home.png|second.png|favicon.ico|sitemap.xml|robots.txt|$).*)',
  ],
};
