import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { sendOrderEmail } from "@/lib/mailer";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();
  
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      productInfo,
      customerDetails,
      quantity,
      variantName
    } = await req.json();

    // 1. Signature Verification
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(text)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await dbConnect();

    // 2. Deduplication: Check if this payment was already processed
    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      return NextResponse.json({ success: true, orderId: existingOrder._id, message: "Duplicate payment processed" });
    }

    let orderId: string | null = null;

    // 3. Atomic Transaction for Stock & Order
    await session.withTransaction(async () => {
      // Step A: Stock Reduction (Atomic)
      let updateResult;
      if (variantName && variantName !== "none") {
        updateResult = await Product.findOneAndUpdate(
          { 
            _id: productInfo.id, 
            "variants.name": variantName,
            "variants.stock": { $gte: quantity } 
          },
          { $inc: { "variants.$.stock": -quantity } },
          { session, new: true }
        );
      } else {
        updateResult = await Product.findOneAndUpdate(
          { 
            _id: productInfo.id, 
            stock: { $gte: quantity } 
          },
          { $inc: { stock: -quantity } },
          { session, new: true }
        );
      }

      if (!updateResult) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      // Step B: Create Order
      const orders = await Order.create([{
        customerDetails,
        products: [{
          productId: productInfo.id,
          quantity: quantity,
          price: productInfo.price,
          name: productInfo.name,
          image: productInfo.image || "",
          variantName: variantName !== "none" ? variantName : undefined
        }],
        totalAmount: productInfo.price * quantity,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        orderStatus: "Confirmed",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        vendorId: productInfo.vendorId,
        statusTimeline: [{
          status: "Confirmed",
          description: "Payment verified successfully via Razorpay",
          timestamp: new Date()
        }]
      }], { session });

      orderId = orders[0]._id.toString();
    });

    // 4. Post-Commit Actions (Emails, etc.)
    // We don't await all of these to speed up response, but it's safer for production to at least try.
    try {
      const orderItemsHtml = `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${productInfo.name}${variantName && variantName !== 'none' ? ` (${variantName})` : ''}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${productInfo.price}</td>
        </tr>
      `;

      const customerHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #27ae60;">Order Confirmation</h2>
          <p>Hi ${customerDetails.firstName || customerDetails.name.split(' ')[0]},</p>
          <p>Thank you for your order! Your payment has been successfully processed.</p>
          <h3>Order details (ID: ${orderId})</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Item</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Qty</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2" style="padding: 10px; text-align: right;">Total Amount:</th>
                <th style="padding: 10px; text-align: left;">₹${productInfo.price * quantity}</th>
              </tr>
            </tfoot>
          </table>
          <p>We'll notify you once it ships.</p>
        </div>
      `;

      await sendOrderEmail({ 
        to: customerDetails.email, 
        subject: `Order Confirmation - #${orderId}`, 
        html: customerHtml 
      });

      const adminEmail = process.env.ADMIN_EMAIL || "admin@fruitbite.com";
      if (adminEmail) {
        const adminHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #c0392b;">New Order Received!</h2>
            <p>Order ID: ${orderId}</p>
            <p>Customer: ${customerDetails.firstName || customerDetails.name} (${customerDetails.email})</p>
            <p>Total Amount: ₹${productInfo.price * quantity}</p>
            <p>Details: ${productInfo.name} x ${quantity}</p>
          </div>
        `;
        await sendOrderEmail({ 
          to: adminEmail, 
          subject: `New Order Received - #${orderId}`, 
          html: adminHtml 
        });
      }
    } catch (emailError) {
      console.error("[EMAIL_NOTIFY_ERROR]", emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    if (error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "Sorry, this product just sold out! Please contact support for a refund." }, { status: 409 });
    }
    console.error("[PAYMENT_VERIFY_ERROR]", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
