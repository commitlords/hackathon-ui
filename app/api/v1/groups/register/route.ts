import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, groupName } = await req.json();

  // Mock duplicate username check
  if (username === "user") {
    return NextResponse.json(
      { message: "Username already exists" },
      { status: 409 },
    );
  }

  // Mock registration success
  return NextResponse.json({
    message: "Registration successful",
    user: {
      id: 102,
      username,
      groupName,
      groupId: "GRP-NEW01",
    },
  });
}

export function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
