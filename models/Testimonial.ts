import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
  name: String,
  location: String,
  text: String,
  rating: Number,
  active: Boolean,
});