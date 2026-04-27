import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

const checkoutSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive().int(),
  customerDetails: z.any().optional(),
  price: z.number().positive(),
  variantName: z.string().optional(),
  image: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid request data", details: validation.error.format() }, { status: 400 });
    }

    const { productId, quantity, price, variantName, image } = validation.data;

    await dbConnect();
    
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // High Concurrency: Step 1 - Pre-check stock
    if (variantName) {
      const variant = product.variants?.find(v => v.name === variantName);
      if (!variant) {
        return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      }
      if (variant.stock < quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${variantName}. Available: ${variant.stock}` }, { status: 400 });
      }
    } else if (product.stock < quantity) {
      return NextResponse.json({ error: `Insufficient stock. Available: ${product.stock}` }, { status: 400 });
    }

    const finalPrice = price || product.price;
    const finalName = variantName ? `${product.name} - ${variantName}` : product.name;
    const finalImage = image || product.images?.[0] || "";

    const amount = (finalPrice * quantity);

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      notes: {
        productId,
        variantName: variantName || "none",
        quantity
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      product: {
        id: product._id.toString(),
        name: finalName,
        price: finalPrice,
        image: finalImage,
        vendorId: product.vendorId?.toString() || "",
      },
    });
  } catch (error) {
    console.error("[RAZORPAY_ORDER_CREATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
