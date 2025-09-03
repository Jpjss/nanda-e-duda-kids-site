// Middleware temporariamente desabilitado para debugging
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Permitir tudo temporariamente
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}