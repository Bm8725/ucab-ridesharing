import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const isLogged = false; // Logica ta de auth (ex: verificare cookie)

    if (isLogged) {
      // Dacă e logat, îl trimiți la dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Dacă NU e logat, îl lași pe "/" (Landing Page)
    // NU folosi redirect către "/" aici, pentru că ești deja pe "/"
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/',
};
