import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { groupid: string; applicationid: string } },
) {
  const { businessInterest, loanAmount, members } = await req.json();
  // Mock application creation
  return NextResponse.json({
    applicationId: params.applicationid,
    groupId: params.groupid,
    businessInterest,
    loanAmount,
    members,
    message: "Application submitted successfully",
  });
}

export function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
