import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // WiFi restriction check
    const userAgent = req.headers.get('user-agent') || ''
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    
    // Check if request is from mobile data (not WiFi)
    const connectionType = req.headers.get('x-connection-type')
    const isWiFi = connectionType === 'wifi' || 
                   req.headers.get('x-forwarded-for')?.includes('192.168') ||
                   req.headers.get('x-forwarded-for')?.includes('10.0') ||
                   req.headers.get('x-forwarded-for')?.includes('172.')
    
    // Allow localhost and development
    if (req.nextUrl.hostname === 'localhost' || req.nextUrl.hostname === '127.0.0.1') {
      return NextResponse.next()
    }
    
    // Block if mobile and not WiFi
    if (isMobile && !isWiFi) {
      return NextResponse.redirect(new URL('/wifi-required', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|wifi-required).*)'
  ]
}
