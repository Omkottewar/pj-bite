import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "8"), 20);

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .populate("categoryId", "name slug")
      .select("name slug price images categoryId")
      .limit(limit)
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[SEARCH_API]", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
