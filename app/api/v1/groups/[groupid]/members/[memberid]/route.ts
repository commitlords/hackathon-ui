import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { groupid: string; memberid: string } },
) {
  const updatedMember = await req.json();
  return NextResponse.json({
    member: {
      ...updatedMember,
      id: params.memberid,
      groupId: params.groupid,
    },
    message: "Member updated successfully",
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { groupid: string; memberid: string } },
) {
  return NextResponse.json({
    message: "Member deleted successfully",
    memberId: params.memberid,
  });
}

export function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
