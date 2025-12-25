import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In absence of a backend endpoint, acknowledge receipt so the client can proceed.
    return NextResponse.json({ success: true, received: true, data: body }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
  }
}
