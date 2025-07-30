import { NextResponse } from 'next/server'

export function middleware(request) {
    const authToken = request.cookies.get('auth-token');
    const { pathname } = request.nextUrl
    const isAuthenticated = authToken && authToken.value;
    
    if (pathname.startsWith('/chat') || pathname.startsWith('/history')) {
        if (!isAuthenticated) {
            const loginUrl = new URL('/login', request.url)
            const response = NextResponse.redirect(loginUrl)
            response.cookies.delete('auth-token')
            return response
        }
    }

    if (pathname === '/login') {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/chat', request.url))
        }
        const response = NextResponse.next()
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        return response
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/chat/:path*', '/history/:path*', '/login']
}
