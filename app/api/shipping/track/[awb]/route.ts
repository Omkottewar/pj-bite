import { NextRequest, NextResponse } from "next/server";

const NIMBUS_BASE_URL = "https://api.nimbuspost.com/v1";
const NIMBUS_API_KEY = process.env.NIMBUS_API_KEY || "";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ awb: string }> }
) {
  try {
    const { awb } = await params;
    const res = await fetch(`${NIMBUS_BASE_URL}/tracking/${awb}`, {
      headers: { "X-API-Key": NIMBUS_API_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Tracking info not available" }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[NIMBUS_TRACK]", error);
    return NextResponse.json({ error: "Failed to fetch tracking" }, { status: 500 });
  }
}
