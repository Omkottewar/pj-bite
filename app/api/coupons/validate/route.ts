import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req: NextRequest) {
  try {
    const { code, cartValue } = await req.json();
    if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });

    await dbConnect();
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    
    if (!coupon.isActive) return NextResponse.json({ error: "Coupon is no longer active" }, { status: 400 });
    
    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }
    
    if (cartValue < coupon.minOrderValue) {
      return NextResponse.json({ error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error during validation" }, { status: 500 });
  }
}
