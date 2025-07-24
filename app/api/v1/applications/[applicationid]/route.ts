import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { applicationid: string } },
) {
  const updates = await req.json();
  // In a real app, you'd update the application in the DB. Here, just echo back the update.
  return NextResponse.json({
    applicationId: params.applicationid,
    ...updates,
    message: "Application updated successfully",
  });
}

export function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
