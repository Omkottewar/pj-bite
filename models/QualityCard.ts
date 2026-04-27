import mongoose, { Schema, Document } from "mongoose";

export interface IQualityCard extends Document {
  title: string;
  desc: string;
  img: string;
  alt: string;
  order: number;
  active: boolean;
}

const QualityCardSchema = new Schema<IQualityCard>(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const QualityCard =
  mongoose.models.QualityCard ||
  mongoose.model<IQualityCard>("QualityCard", QualityCardSchema);
export default QualityCard;
