import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const tag = url.searchParams.get("tag");
    const admin = url.searchParams.get("admin") === "true";

    let filter: any = { published: true };
    
    // If admin is requesting, allow seeing drafts
    if (admin) {
      const session = await getServerSession(authOptions);
      if (session && ((session.user as any).role === "SUPERADMIN" || (session.user as any).role === "ADMIN")) {
        filter = {}; // No filter, see all
      }
    }

    if (tag) {
      filter.tags = tag;
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: blogs.length, data: blogs });
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

    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Set publishedAt if published is true
    if (body.published && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "A blog with that slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
