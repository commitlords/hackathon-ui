import { NextRequest, NextResponse } from "next/server";

const mockBusinessInterests = [
  { id: 1, name: "Retail" },
  { id: 2, name: "Agriculture" },
  { id: 3, name: "Manufacturing" },
  { id: 4, name: "Services" },
  { id: 5, name: "Technology" },
];

export function GET() {
  return NextResponse.json({ interests: mockBusinessInterests });
}

export function POST() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
