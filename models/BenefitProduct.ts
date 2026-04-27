import mongoose, { Schema, Document } from "mongoose";

export interface IBenefitProduct extends Document {
  name: string;
  tagline: string;
  benefits: string[];
  desc: string;
  bgColor: string;
  iconType: string;
  order: number;
  active: boolean;
}

const BenefitProductSchema = new Schema<IBenefitProduct>(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    desc: { type: String, default: "" },
    bgColor: { type: String, default: "bg-amber-50" },
    iconType: { type: String, default: "mixed" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BenefitProduct =
  mongoose.models.BenefitProduct ||
  mongoose.model<IBenefitProduct>("BenefitProduct", BenefitProductSchema);
export default BenefitProduct;
