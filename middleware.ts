import { NextRequest, NextResponse } from 'next/server'
import { getPocketBase } from './lib/pocketbase'

export default async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const token = req.cookies.get("dahab_admin_auth")?.value

    if (token) {
      try {
        const pb = getPocketBase()

        pb.authStore.loadFromCookie(token)

        await pb.collection("admins").authRefresh()
        
        return res
      } catch (error) {
        console.log("authRefresh:", error)
      }
    }
    // If not authenticated, redirect to home page (which has the login form)
    return NextResponse.redirect(new URL("/login", req.url))
}
 
// Routes Middleware should not run on
export const config = {
  matcher: "/admin/:path*",
}