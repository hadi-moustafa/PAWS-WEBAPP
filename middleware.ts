import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    // 1. Update Session (Refresh Auth Token)
    const { response, user } = await updateSession(request)

    const path = request.nextUrl.pathname

    // 2. Define Protected Routes
    const isSuperAdminRoute = path.startsWith('/superadmin')
    const isAdminRoute = path.startsWith('/admin')
    const isVetRoute = path.startsWith('/vet')

    // 3. Auth Guard: If trying to access protected route without user
    if ((isSuperAdminRoute || isAdminRoute || isVetRoute) && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 4. Role Guard
    if (user) {
        const role = user.user_metadata?.role as string // 'Super_Admin', 'Admin', 'Vet', 'User'

        if (isSuperAdminRoute && role !== 'Super_Admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (isAdminRoute && role !== 'Admin' && role !== 'Super_Admin') {
            // Super Admin can usually access Admin areas, but strictly implementing per spec first
            // Spec says: Roles: SUPER_ADMIN, ADMIN, VET
            // Assuming strict separation unless specified otherwise. 
            // User requested: "restricts access to /superadmin/*, /admin/*, and /vet/* routes"
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        if (isVetRoute && role !== 'Vet') {
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        // Redirect logged-in users away from Login/Landing to their dashboard?
        // Optional, but good UX.
        if (path === '/login' || path === '/') {
            // Simple redirection logic based on role
            if (role === 'Super_Admin') return NextResponse.redirect(new URL('/superadmin', request.url))
            if (role === 'Admin') return NextResponse.redirect(new URL('/admin', request.url))
            if (role === 'Vet') return NextResponse.redirect(new URL('/vet', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
