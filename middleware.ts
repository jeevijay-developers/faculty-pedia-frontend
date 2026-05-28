import { NextRequest, NextResponse } from "next/server";

// Routes that require any authenticated session
const PROTECTED_PREFIXES = [
  "/exams",
  "/course-panel",
  "/profile",
  "/details",
  "/test-series",
  "/webinars",
];

// Routes that should redirect authenticated users away (e.g. login page)
const REDIRECT_WHEN_AUTHED = ["/join-as-student"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("fp_session");

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already-authenticated users away from signup
  if (REDIRECT_WHEN_AUTHED.some((p) => pathname.startsWith(p))) {
    if (session) {
      const dest = session.value === "student" ? "/exams" : "/";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/exams/:path*",
    "/course-panel/:path*",
    "/profile/:path*",
    "/details/:path*",
    "/test-series/:path*",
    "/webinars/:path*",
    "/join-as-student",
  ],
};
