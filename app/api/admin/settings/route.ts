import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StoreSettings from "@/models/StoreSettings";
import Coupon from "@/models/Coupon"; // Import for populate
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

/**
 * GET: Fetch global settings for storefront or admin.
 */
export async function GET() {
  try {
    await dbConnect();
    // Explicitly ensure Coupon schema is registered before populate
    require("@/models/Coupon");
    // Singleton approach: Ensure at least one settings record exists
    let settings = await StoreSettings.findOne().populate('featuredCouponIds');
    if (!settings) {
      settings = await StoreSettings.create({
        freeShippingThreshold: 499,
        shippingCost: 50,
        codCharge: 50,
        isCodEnabled: true,
        prepaidDiscountPercentage: 0,
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

/**
 * PATCH: Update global settings (ADMIN ONLY).
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();
    const body = await req.json();
    
    // singleton model
    const settings = await StoreSettings.findOneAndUpdate({}, body, { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true 
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
