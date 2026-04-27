import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
  question: String,
  answer: String,
  order: Number,
  active: { type: Boolean, default: true },
});