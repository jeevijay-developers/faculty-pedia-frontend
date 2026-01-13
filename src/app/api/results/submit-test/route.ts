import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${API_BASE}/api/results/submit-test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("submit-test proxy error", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit test result" },
      { status: 500 }
    );
  }
}
