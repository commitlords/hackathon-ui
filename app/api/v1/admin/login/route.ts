import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // Mock credentials
  if (username === "admin" && password === "password123") {
    return NextResponse.json({
      token: "mock-admin-token-123",
      admin: {
        id: 1,
        username: "admin",
        name: "Admin User",
        role: "superadmin",
      },
    });
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }
}

export function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
