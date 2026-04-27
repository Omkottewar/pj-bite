"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import User from "@/models/User";
import mongoose from "mongoose";

export async function checkReviewEligibility(productId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { eligible: false, status: "UNAUTHENTICATED", message: "Log in to leave a review." };
    }

    await dbConnect();
    const userEmail = session.user.email;
    
    // Look up user ID explicitly to satisfy TS NextAuth bounds
    const dbUser = await User.findOne({ email: userEmail }).lean();
    if (!dbUser) return { eligible: false, status: "UNAUTHENTICATED", message: "User not found." };
    
    const userId = dbUser._id;

    // 1. Check if already reviewed
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return { eligible: false, status: "ALREADY_REVIEWED", message: "You have already reviewed this product." };
    }

    // 2. Check if there's a DELIVERED order matching the email and productId
    const matchingOrder = await Order.findOne({
      "customerDetails.email": userEmail,
      deliveryStatus: "DELIVERED",
      "products.productId": new mongoose.Types.ObjectId(productId),
    });

    if (!matchingOrder) {
      return { eligible: false, status: "UNVERIFIED", message: "You can only review products after they have been delivered to you." };
    }

    return { eligible: true, status: "ELIGIBLE", message: "You are eligible to review." };
  } catch (error) {
    console.error("Review Eligibility Check Error:", error);
    return { eligible: false, status: "ERROR", message: "Error checking review eligibility." };
  }
}

export async function createReview(productId: string, rating: number, comment?: string, image?: string) {
  try {
    const eligibility = await checkReviewEligibility(productId);
    if (!eligibility.eligible) {
      return { success: false, error: eligibility.message };
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { success: false, error: "Unauthorized" };

    const userEmail = session.user.email;
    const dbUser = await User.findOne({ email: userEmail }).lean();
    if (!dbUser) return { success: false, error: "User not found in database." };

    const review = await Review.create({
      user: dbUser._id,
      product: productId,
      rating,
      comment,
      image,
    });

    revalidatePath(`/products`);
    revalidatePath(`/products/[slug]`, "page");

    return { success: true, reviewId: review._id.toString() };
  } catch (error: any) {
    console.error("Create Review Error:", error);
    if (error.code === 11000) {
      return { success: false, error: "You have already reviewed this product." };
    }
    return { success: false, error: error.message || "Failed to submit review." };
  }
}

export async function getProductReviews(productId: string) {
  try {
    await dbConnect();
    const reviews = await Review.find({ product: productId, isPublished: true })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    const formattedReviews = reviews.map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      user: {
        _id: r.user?._id?.toString() || "",
        name: r.user?.name || "Verified Buyer",
      },
      product: r.product.toString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    // Calculate aggregated stats
    const total = formattedReviews.length;
    const average = total > 0 
      ? formattedReviews.reduce((acc, curr) => acc + curr.rating, 0) / total 
      : 0;

    return {
      reviews: formattedReviews,
      stats: {
        total,
        average: Number(average.toFixed(1)),
      }
    };
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return { reviews: [], stats: { total: 0, average: 0 } };
  }
}
