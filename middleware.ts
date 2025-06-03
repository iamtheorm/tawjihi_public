import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*', '/settings/:path*', '/profile/:path*']
} 