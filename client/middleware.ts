import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const authCookie = request.cookies.get("sb_auth")?.value
  const isAuthenticated = Boolean(authCookie)

  const isAuthPage =
    pathname === "/login"

  const isPublicPage = pathname === "/"

  const isDashboard = pathname.startsWith("/dashboard")

  if (isAuthenticated) {
    if (isAuthPage || isPublicPage) {
      console.log("[Middleware] Authenticated user redirected to /dashboard")
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      )
    }
    return NextResponse.next()
  }

  if (!isAuthenticated && isDashboard) {
    console.log("[Middleware] Unauthenticated user blocked from dashboard")
    return NextResponse.redirect(
      new URL("/login", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
  ],
}
