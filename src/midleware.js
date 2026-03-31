import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh la sesiune
  const { data: { user } } = await supabase.auth.getUser()

  // REDIRECTS:
  // 1. Dacă vrei la profil/checkout și NU ești logat -> marș la login
  if (!user && (request.nextUrl.pathname.startsWith('/myaccount') || request.nextUrl.pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Dacă EȘTI logat și vrei la login/register -> marș la profil
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname === '/account')) {
    return NextResponse.redirect(new URL('/myaccount', request.url))
  }

  return response
}

export const config = {
  matcher: ['/myaccount/:path*', '/checkout/:path*', '/login', '/account'],
}
