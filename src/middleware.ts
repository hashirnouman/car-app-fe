import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const isAuthenticated = checkAuth(request)

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

function checkAuth(request: NextRequest): boolean {
    // In a real application, you'd check for a valid session or token
    // For this example, we'll just check for a cookie named 'auth'
    const authCookie = request.cookies.get('auth')
    return authCookie?.value === 'authenticated'
}

export const config = {
    matcher: '/home',
}
