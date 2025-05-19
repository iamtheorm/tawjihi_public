import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected (require authentication)
const protectedPaths = ['/dashboard', '/settings', '/profile']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  // If it's a protected path and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access login page, redirect to dashboard
  if (pathname === '/' && token) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/profile/:path*']
} 