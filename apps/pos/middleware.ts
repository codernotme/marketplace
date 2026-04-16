import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@workspace/auth/lib/auth";
import { canAccessApp, resolveRequestMeta, getPrimaryApp, APP_ROOTS } from "@workspace/auth/lib/proxy";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { app } = resolveRequestMeta(request.headers.get("host") || "");
  
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                     request.nextUrl.pathname.startsWith("/register") ||
                     request.nextUrl.pathname.startsWith("/forgot-password") ||
                     request.nextUrl.pathname.startsWith("/reset-password");

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session) {
    const role = session.user.role || "CUSTOMER";
    
    if (!canAccessApp(role, app)) {
      const primaryApp = getPrimaryApp(role);
      const redirectUrl = APP_ROOTS[primaryApp];
      return NextResponse.redirect(new URL(redirectUrl));
    }
    
    if (isAuthPage) {
       return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
