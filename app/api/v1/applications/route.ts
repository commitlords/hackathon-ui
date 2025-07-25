import {NextResponse } from "next/server";

const mockApplications = [
  {
    applicationId: "APP-10001",
    groupId: "GRP-12345",
    groupName: "Awesome Coders",
    businessInterest: "Tailoring",
    createdAt: "2024-06-01T10:00:00Z",
    status: "Pending",
    reason: "",
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
  },
  {
    applicationId: "APP-10002",
    groupId: "GRP-67890",
    groupName: "Makers United",
    businessInterest: "Handicrafts",
    createdAt: "2024-06-02T14:30:00Z",
    status: "Pending",
    reason: "",
    members: [
      {
        id: "MEM-003",
        name: "Kavita Singh",
        email: "kavita.singh@example.com",
        phone: "1122334455",
        dob: "1992-03-15",
        sex: "Female",
        aadhar: "111122223333",
        pan: "LMNOP1234Q",
        bankName: "Axis Bank",
        bankAccount: "55566677788",
        ifsc: "UTIB0001234",
        photo: "",
      },
      {
        id: "MEM-004",
        name: "Meena Kumari",
        email: "meena.kumari@example.com",
        phone: "5566778899",
        dob: "1988-11-22",
        sex: "Female",
        aadhar: "444455556666",
        pan: "QRSTU5678V",
        bankName: "HDFC Bank",
        bankAccount: "99988877766",
        ifsc: "HDFC0005678",
        photo: "",
      },
    ],
  },
];

export function GET() {
  return NextResponse.json({ applications: mockApplications });
}

export function POST() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
