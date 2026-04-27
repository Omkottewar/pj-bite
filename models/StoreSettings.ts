import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreSettings extends Document {
  freeShippingThreshold: number;
  shippingCost: number;
  codCharge: number;
  isCodEnabled: boolean;
  prepaidDiscountPercentage: number;
  featuredCouponIds: mongoose.Types.ObjectId[];
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>({
  freeShippingThreshold: { type: Number, default: 499 },
  shippingCost: { type: Number, default: 2 },
  codCharge: { type: Number, default: 50 },
  isCodEnabled: { type: Boolean, default: true },
  prepaidDiscountPercentage: { type: Number, default: 0 },
  featuredCouponIds: [{ type: Schema.Types.ObjectId, ref: 'Coupon' }],
}, { timestamps: true });

export default mongoose.models.StoreSettings || mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
