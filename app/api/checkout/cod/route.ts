import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { 
      productInfo,
      customerDetails,
      quantity
    } = await req.json();

    await dbConnect();

    const newOrder = await Order.create({
      customerDetails,
      products: [{
        productId: productInfo.id,
        quantity: quantity,
        price: productInfo.price,
        name: productInfo.name,
        image: productInfo.image || "",
      }],
      totalAmount: productInfo.price * quantity,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      orderStatus: "Pending",
      vendorId: productInfo.vendorId,
    });

    // Send order confirmation to customer
    const orderItemsHtml = `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${productInfo.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${productInfo.price}</td>
      </tr>
    `;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2e7d32;">Order Received (COD)</h2>
        <p>Hi ${customerDetails.firstName},</p>
        <p>Thank you for your order! We've received your request for Cash on Delivery.</p>
        <h3>Order details (ID: ${newOrder._id})</h3>
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
        </table>
        <p><strong>Payment Mode:</strong> Cash on Delivery</p>
        <p>We'll notify you once it ships. Please keep ₹${productInfo.price * quantity} ready at the time of delivery.</p>
      </div>
    `;

    await sendOrderEmail({ 
      to: customerDetails.email, 
      subject: `Order Received (COD) - #${newOrder._id}`, 
      html: customerHtml 
    });

    return NextResponse.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.error("[COD_ORDER_ERROR]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
