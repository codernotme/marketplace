import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export default async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude auth routes from protection
  if (pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect UNASSIGNED users to unauthorized page
  // @ts-ignore
  if (session.user?.role === "UNASSIGNED" && !pathname.startsWith("/auth/unauthorized")) {
    return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
  }

  // Prevent accessing unauthorized page if user has a role
  // @ts-ignore
  if (session.user?.role !== "UNASSIGNED" && pathname.startsWith("/auth/unauthorized")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
