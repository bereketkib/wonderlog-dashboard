import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refreshToken");
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ["/error"];

  // Check if the path is public
  const isPublicPath = publicPaths.some((pp) => path.startsWith(pp));

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  // If has token and trying to access login
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
