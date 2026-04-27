import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBanner extends Document {
  type: "home" | "product"; // Location of the banner
  title?: string;
  subtitle?: string;
  imageUrl: string; 
  linkUrl?: string; // Where it redirects on click
  active: boolean;
  order: number; // Sorting order
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    type: {
      type: String,
      enum: ["home", "product"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Banner image URL is required"],
    },
    linkUrl: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
