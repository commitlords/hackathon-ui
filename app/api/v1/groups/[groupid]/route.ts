import { NextRequest, NextResponse } from "next/server";

export function GET(
  req: NextRequest,
  { params }: { params: { groupid: string } },
) {
  return NextResponse.json({
    groupId: params.groupid,
    members: [
      {
        id: "MEM-001",
        name: "Jaya Patil",
        email: "jaya.patil@example.com",
        phone: "1234567890",
        dob: "1990-01-01",
        sex: "Female",
        aadhar: "123456789012",
        pan: "ABCDE1234F",
        bankName: "State Bank of India",
        bankAccount: "12345678901",
        ifsc: "SBIN0001234",
        photo: "",
      },
      {
        id: "MEM-002",
        name: "Sunita Sharma",
        email: "sunita.sharma@example.com",
        phone: "0987654321",
        dob: "1985-05-10",
        sex: "Female",
        aadhar: "987654321098",
        pan: "XYZAB9876P",
        bankName: "Punjab National Bank",
        bankAccount: "98765432109",
        ifsc: "PUNB0123456",
        photo: "",
      },
    ],
  });
}
