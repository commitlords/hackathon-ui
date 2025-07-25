import { NextResponse } from "next/server";

const mockBusinessInterests = [
  { id: 1, name: "Retail" },
  { id: 2, name: "Agriculture" },
  { id: 3, name: "Manufacturing" },
  { id: 4, name: "Services" },
  { id: 5, name: "Technology" },
];

export function GET() {
  try {
    return NextResponse.json({ interests: mockBusinessInterests });
  } catch (err) {
    const errorMsg =
      err instanceof Error
        ? `"${err.message}"`
        : "Could not load business interests.";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export function POST() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
