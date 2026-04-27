import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface IOrder extends Document {
  customerDetails: {
    name: string;
    email: string;
    address: string;
    phone: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  products: IOrderItem[];
  totalAmount: number;

  // Payment
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  // Delivery
  deliveryStatus: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';

  // Cancellation
  cancellationRequested?: boolean;
  cancellationReason?: string;
  cancellationRequestedAt?: Date;
  cancelledAt?: Date;

  // Refund
  refundStatus?: 'NOT_REQUESTED' | 'PENDING' | 'PROCESSED' | 'FAILED';
  razorpayRefundId?: string;
  refundAmount?: number;
  refundProcessedAt?: Date;
  refundNote?: string;

  // Nimbus Post / Shipping
  trackingId?: string;          // Nimbus Post AWB (Legacy)
  awbNumber?: string;           // Nimbus Post AWB (Current)
  shipmentId?: string;          // Nimbus Post shipment ID
  courierName?: string;
  labelUrl?: string;            // PDF Label URL
  trackingUrl?: string;         // Direct Tracking URL
  currentShipmentStatus?: string;
  statusTimeline: Array<{
    status: string;
    description: string;
    timestamp: Date;
    location?: string;
  }>;

  // New Unified Status fields
  paymentMethod: 'RAZORPAY' | 'COD';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled' | 'Returned' | 'RTO';

  // Offer
  couponCode?: string;
  discountApplied?: number;
  vendorId?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    products: [OrderItemSchema],
    totalAmount: { type: Number, required: true },

    // Payment
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
      default: 'PENDING',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },

    // Delivery
    deliveryStatus: {
      type: String,
      enum: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'],
      default: 'PROCESSING',
    },

    // Cancellation
    cancellationRequested: { type: Boolean, default: false },
    cancellationReason: { type: String },
    cancellationRequestedAt: { type: Date },
    cancelledAt: { type: Date },

    // Refund
    refundStatus: {
      type: String,
      enum: ['NOT_REQUESTED', 'PENDING', 'PROCESSED', 'FAILED'],
      default: 'NOT_REQUESTED',
    },
    razorpayRefundId: { type: String },
    refundAmount: { type: Number },
    refundProcessedAt: { type: Date },
    refundNote: { type: String },

    // Nimbus Post / Courier
    trackingId: { type: String },
    awbNumber: { type: String, index: true },
    shipmentId: { type: String },
    courierName: { type: String },
    labelUrl: { type: String },
    trackingUrl: { type: String },
    currentShipmentStatus: { type: String },
    statusTimeline: [{
      status: { type: String, required: true },
      description: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      location: { type: String }
    }],

    // Unified Status Logic
    paymentMethod: { 
      type: String, 
      enum: ['RAZORPAY', 'COD'], 
      default: 'RAZORPAY' 
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled', 'Returned', 'RTO'],
      default: 'Pending'
    },

    // Offers
    couponCode: { type: String },
    discountApplied: { type: Number, default: 0 },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

// Index for fast admin queries
OrderSchema.index({ deliveryStatus: 1, paymentStatus: 1 });
OrderSchema.index({ cancellationRequested: 1 });
OrderSchema.index({ refundStatus: 1 });
OrderSchema.index({ 'customerDetails.email': 1 });

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
