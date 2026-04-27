import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  tagline?: string;
  claims: string[];
  description: string;
  heroHighlights?: string[];
  ingredients?: string;
  nutrition?: string;
  benefits?: string;
  price: number;
  originalPrice?: number;
  variants?: { name: string; price: number; stock: number }[];
  images: string[];
  descriptionImages?: string[];
  vendorId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  isFeatured: boolean;
  stock: number; // Base stock if no variants
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tagline: {
      type: String,
    },
    claims: {
      type: [String],
      default: ["No Added Sugar", "No Preservatives", "Packed with Goodness", "With Natural Farming"],
    },
    description: {
      type: String,
      required: true,
    },
    heroHighlights: {
      type: [String],
      default: [],
    },
    ingredients: { type: String, trim: true },
    nutrition: { type: String, trim: true },
    benefits: { type: String, trim: true },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    variants: [{
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      stock: { type: Number, default: 0 }
    }],
    images: {
      type: [String],
      default: [],
    },
    descriptionImages: {
      type: [String],
      default: [],
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
