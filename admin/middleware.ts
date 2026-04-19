import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow auth routes and Better Auth API routes
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // For all other protected routes, check session
  const { data: session } = await betterFetch<any>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  // No session — redirect to login
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Session exists but role is UNASSIGNED — redirect to unauthorized page
  const user = (session as any).user;
  if (pathname.startsWith("/dashboard") && user?.role === "UNASSIGNED") {
    return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - Public files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
