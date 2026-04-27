import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";

// GET /api/wishlist — return full product objects for the user's wishlist
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email })
    .populate({
      path: "wishlist",
      model: Product,
      select: "_id name slug price originalPrice images",
    })
    .lean();

  if (!user) return NextResponse.json({ items: [] });

  return NextResponse.json({ items: (user as any).wishlist || [] });
}

// POST /api/wishlist — add a product to wishlist
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  await dbConnect();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).lean();

  return NextResponse.json({ success: true, count: (user as any)?.wishlist?.length ?? 0 });
}

// DELETE /api/wishlist — remove a product from wishlist
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  await dbConnect();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $pull: { wishlist: productId } },
    { new: true }
  ).lean();

  return NextResponse.json({ success: true, count: (user as any)?.wishlist?.length ?? 0 });
}
