import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ADAUGĂ "default" AICI:
export default function proxy(request: NextRequest) { 
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const isLogged = false; 

    if (isLogged) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/',
};
