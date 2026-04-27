import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Banner } from "@/models/Banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const activeOnly = url.searchParams.get("active") === "true";

    let filter: any = {};
    if (type) filter.type = type;
    if (activeOnly) filter.active = true;

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, count: banners.length, data: banners });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "SUPERADMIN" && (session.user as any).role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
