import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fp_session";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// POST /api/auth/session — called after login to plant the httpOnly session cookie
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const userType: string = body.userType ?? "student";

  const response = NextResponse.json({ success: true });

  response.cookies.set(COOKIE_NAME, userType, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });

  return response;
}

// DELETE /api/auth/session — called on logout to remove the session cookie
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
