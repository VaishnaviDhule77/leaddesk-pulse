import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('leaddesk-token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
    try { await jwtVerify(token, secret); } catch { return NextResponse.redirect(new URL('/admin/login', request.url)); }
  }

  if (pathname === '/admin/login' && token) {
    try { await jwtVerify(token, secret); return NextResponse.redirect(new URL('/admin/dashboard', request.url)); } catch {}
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/dashboard/:path*', '/admin/login'] };