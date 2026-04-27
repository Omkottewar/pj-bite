import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const { items, customerDetails, couponCode } = await req.json(); // items is array of {id, quantity}

    await dbConnect();
    
    let totalAmount = 0;
    const validatedProducts = [];

    for (const item of items) {
      const product = await Product.findById(item.id).lean() as any;
      if (!product) continue;
      
      // Stock Validation
      if (item.variantId) {
        const variant = product.variants?.find((v: any) => v._id.toString() === item.variantId);
        if (!variant || (variant.stock ?? 0) < item.quantity) {
          return NextResponse.json({ 
            error: `Insufficient stock for ${product.name}${variant ? ` (${variant.name})` : ""}. Only ${variant?.stock || 0} left.` 
          }, { status: 400 });
        }
      } else {
        if ((product.stock ?? 0) < item.quantity) {
          return NextResponse.json({ 
            error: `Insufficient stock for ${product.name}. Only ${product.stock} left.` 
          }, { status: 400 });
        }
      }

      const lineCost = (item.price || product.price) * item.quantity;
      totalAmount += lineCost;
      
      validatedProducts.push({
        productId: product._id.toString(),
        variantId: item.variantId || null,
        name: item.name || product.name,
        price: item.price || product.price,
        quantity: item.quantity,
        vendorId: product.vendorId.toString(),
        image: item.image || product.images?.[0] || "",
      });
    }

    if (validatedProducts.length === 0) {
      return NextResponse.json({ error: "No valid products in cart" }, { status: 400 });
    }

    let discountApplied = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (coupon && coupon.isActive && new Date(coupon.expiryDate) > new Date() && totalAmount >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discountApplied = (totalAmount * coupon.discountValue) / 100;
        } else {
          discountApplied = coupon.discountValue;
        }
      }
    }

    const finalAmount = Math.max(totalAmount - discountApplied, 0);

    const options = {
      amount: Math.round(finalAmount * 100), // paise
      currency: "INR",
      receipt: `receipt_cart_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      products: validatedProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create cart order" }, { status: 500 });
  }
}
