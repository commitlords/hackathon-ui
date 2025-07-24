import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // Mock credentials
  if (username === "user" && password === "password123") {
    return NextResponse.json({
      token: "mock-user-token-456",
      user: {
        id: 101,
        username: "user",
        name: "User Group",
        groupId: "GRP-12345",
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
