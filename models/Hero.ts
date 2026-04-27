// models/Hero.ts
import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  title: String,
  image: String,
  subtitle: String,
  ctaText: String,
  ctaLink: String,
  order: Number,
  active: { type: Boolean, default: true },
});

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);