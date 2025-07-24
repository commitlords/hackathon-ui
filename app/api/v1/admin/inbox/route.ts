import { NextRequest, NextResponse } from "next/server";

const mockInbox = [
  {
    id: "MSG-1001",
    type: "Loan Request",
    subject: "New Loan Application from GRP-12345",
    relatedGroupId: "GRP-12345",
    relatedApplicationId: "APP-10001",
    status: "unread",
    timestamp: "2024-06-01T10:05:00Z",
    content: "A new loan application has been submitted by group GRP-12345.",
    direction: "in",
  },
  {
    id: "MSG-1002",
    type: "Disbursement",
    subject: "Loan Disbursement Request Sent",
    relatedGroupId: "GRP-67890",
    relatedApplicationId: "APP-10002",
    status: "read",
    timestamp: "2024-06-02T15:00:00Z",
    content:
      "Loan disbursement request has been sent to the bank for group GRP-67890.",
    direction: "out",
  },
  {
    id: "MSG-1003",
    type: "Certificate",
    subject: "Digital Certificate Issued",
    relatedGroupId: "GRP-12345",
    relatedApplicationId: "APP-10001",
    status: "unread",
    timestamp: "2024-06-03T09:30:00Z",
    content:
      "Digital certificates have been issued to all members of group GRP-12345.",
    direction: "out",
  },
];

export function GET() {
  return NextResponse.json({ messages: mockInbox });
}

export async function POST(req: NextRequest) {
  const msg = await req.json();
  return NextResponse.json({
    ...msg,
    id: "MSG-" + Math.floor(Math.random() * 10000),
    timestamp: new Date().toISOString(),
    status: "unread",
  });
}
