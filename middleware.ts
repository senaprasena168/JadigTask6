import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('🔥 Middleware triggered for:', request.nextUrl.pathname)
  
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('🔒 Admin route detected, checking authentication...')
    
    // Get the auth data from cookies
    const authCookie = request.cookies.get('auth')
    console.log('🍪 Auth cookie exists:', !!authCookie)
    
    // If no auth cookie exists, redirect to login
    if (!authCookie) {
      console.log('❌ No auth cookie found, redirecting to login')
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    try {
      // Parse the auth cookie to verify authentication
      const authData = JSON.parse(authCookie.value)
      console.log('📋 Auth data:', authData)
      
      // Check if user is authenticated and has admin role
      if (!authData.isAuthenticated || authData.user?.role !== 'admin') {
        console.log('🚫 User not authenticated or not admin, redirecting to login')
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      console.log('✅ User authenticated as admin, allowing access')
    } catch (error) {
      // Invalid cookie data, redirect to login
      console.warn('💥 Invalid auth cookie:', error)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}