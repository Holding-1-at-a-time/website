import { MutationCtx, QueryCtx } from "../_generated/server";
import { v } from "convex/values";

/**
 * Review business logic - separated from API functions
 * These functions contain the core business logic and can be called from both 
 * internal and public Convex functions
 */

export interface ReviewData {
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  serviceId: string;
  isApproved?: boolean;
  isFeatured?: boolean;
  date?: string; // ISO date string
}

/**
 * Get approved reviews for public display
 */
export async function getApprovedReviews(ctx: QueryCtx, limit: number = 20) {
  return await ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .order("desc")
      .take(limit);
}

/**
 * Get featured reviews for homepage display
 */
export async function getFeaturedReviews(ctx: QueryCtx, limit: number = 6) {
  return await ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("isApproved", true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .order("desc")
      .take(limit);
}

/**
 * Get reviews by service ID
 */
export async function getReviewsByService(
  ctx: QueryCtx,
  serviceId: string,
  approvedOnly: boolean = true,
  limit: number = 50
) {
  const query = ctx.db
    .query("reviews")
    .withIndex("by_service", (q) => q.eq("serviceId", serviceId));
  
  const filteredQuery = approvedOnly
    ? query.filter((q) => q.eq(q.field("isApproved"), true))
    : query;
  
  return await filteredQuery.order("desc").take(limit);
}

/**
 * Get all reviews for admin view
 */
export async function getAllReviews(ctx: QueryCtx, limit: number = 100) {
  return await ctx.db
      .query("reviews")
      .order("desc")
      .take(limit);
}

/**
 * Get pending reviews for admin approval
 */
export async function getPendingReviews(ctx: QueryCtx, limit: number = 50) {
  return await ctx.db
      .query("reviews")
      .withIndex("by_approved", (q) => q.eq("isApproved", false))
      .order("desc")
      .take(limit);
}

/**
 * Get review by ID
 */
export async function getReviewById(ctx: QueryCtx, reviewId: string) {
  return await ctx.db.get(reviewId);
}

/**
 * Create a new review (requires approval)
 */
export async function createReview(
  ctx: MutationCtx,
  reviewData: ReviewData
): Promise<string> {
  // Check for duplicate reviews from same customer for same service
  const existingReviews = await ctx.db
    .query("reviews")
    .withIndex("by_service", (q) => q.eq("serviceId", reviewData.serviceId))
    .filter((q) => q.eq(q.field("customerName"), reviewData.customerName))
    .take(5);
  
  // Check if customer has already reviewed this service recently
  const recentReview = existingReviews.find(r => 
    Date.now() - r._creationTime < 30 * 24 * 60 * 60 * 1000 // 30 days
  );
  
  if (recentReview) {
    throw new Error("You have already reviewed this service recently. Thank you!");
  }
  
  // Validate that the service exists
  const service = await ctx.db.get(reviewData.serviceId);
  if (!service) {
    throw new Error("Selected service not found");
  }
  
  // Validate rating (1-5 stars)
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("Rating must be between 1 and 5 stars");
  }
  
  const reviewId = await ctx.db.insert("reviews", {
    customerName: reviewData.customerName,
    rating: reviewData.rating,
    comment: reviewData.comment,
    serviceId: reviewData.serviceId,
    isApproved: reviewData.isApproved ?? false,
    isFeatured: reviewData.isFeatured ?? false,
    date: reviewData.date || new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  
  // Log the review creation
  await logReviewActivity(ctx, "review_submitted", reviewId, {
    customerName: reviewData.customerName,
    serviceId: reviewData.serviceId,
    rating: reviewData.rating,
  });
  
  return reviewId;
}

/**
 * Approve a review (admin only)
 */
export async function approveReview(
  ctx: MutationCtx,
  reviewId: string,
  isFeatured: boolean = false
): Promise<void> {
  // Get existing review
  const existingReview = await ctx.db.get(reviewId);
  if (!existingReview) {
    throw new Error("Review not found");
  }
  
  if (existingReview.isApproved) {
    throw new Error("Review is already approved");
  }
  
  await ctx.db.patch(reviewId, {
    isApproved: true,
    isFeatured: isFeatured,
    updatedAt: Date.now(),
  });
  
  // Log the approval
  await logReviewActivity(ctx, "review_approved", reviewId, {
    customerName: existingReview.customerName,
    isFeatured: isFeatured,
  });
}

/**
 * Reject a review (admin only)
 */
export async function rejectReview(
  ctx: MutationCtx,
  reviewId: string,
  reason?: string
): Promise<void> {
  // Get existing review
  const existingReview = await ctx.db.get(reviewId);
  if (!existingReview) {
    throw new Error("Review not found");
  }
  
  // Delete the review instead of just rejecting
  await ctx.db.delete(reviewId);
  
  // Log the rejection
  await logReviewActivity(ctx, "review_rejected", reviewId, {
    customerName: existingReview.customerName,
    reason: reason || "No reason provided",
  });
}

/**
 * Toggle featured status of a review (admin only)
 */
export async function toggleFeaturedReview(
  ctx: MutationCtx,
  reviewId: string
): Promise<{ isFeatured: boolean }> {
  // Get existing review
  const existingReview = await ctx.db.get(reviewId);
  if (!existingReview) {
    throw new Error("Review not found");
  }
  
  if (!existingReview.isApproved) {
    throw new Error("Cannot feature an unapproved review");
  }
  
  // Toggle featured status
  const newFeaturedStatus = !existingReview.isFeatured;
  
  await ctx.db.patch(reviewId, {
    isFeatured: newFeaturedStatus,
    updatedAt: Date.now(),
  });
  
  // Log the status change
  await logReviewActivity(ctx, "review_featured_toggled", reviewId, {
    customerName: existingReview.customerName,
    isFeatured: newFeaturedStatus,
  });
  
  return { isFeatured: newFeaturedStatus };
}

/**
 * Update review content (admin only, limited fields)
 */
export async function updateReview(
  ctx: MutationCtx,
  reviewId: string,
  updates: {
    comment?: string;
    rating?: number;
  }
): Promise<void> {
  // Get existing review
  const existingReview = await ctx.db.get(reviewId);
  if (!existingReview) {
    throw new Error("Review not found");
  }
  
  // Prepare update data
  const updatePayload: { comment?: string; rating?: number; updatedAt: number } = {
    updatedAt: Date.now(),
  };
  
  // Only update provided fields
  if (updates.comment !== undefined) {
    // Sanitize comment content
    updatePayload.comment = updates.comment.trim().slice(0, 1000); // Max 1000 chars
  }
  
  if (updates.rating !== undefined) {
    // Validate rating
    if (updates.rating < 1 || updates.rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }
    updatePayload.rating = updates.rating;
  }
  
  await ctx.db.patch(reviewId, updatePayload);
  
  // Log the update
  await logReviewActivity(ctx, "review_updated", reviewId, {
    customerName: existingReview.customerName,
    changes: Object.keys(updates).join(", "),
  });
}

/**
 * Get review statistics for admin dashboard
 */
export async function getReviewStats(ctx: QueryCtx) {
  const allReviews = await ctx.db
    .query("reviews")
    .take(5000); // Reasonable limit for statistics
  
  const approvedReviews = allReviews.filter(r => r.isApproved);
  const featuredReviews = approvedReviews.filter(r => r.isFeatured);
  const pendingReviews = allReviews.filter(r => !r.isApproved);
  
  // Calculate average rating
  const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = approvedReviews.length > 0 ? totalRating / approvedReviews.length : 0;
  
  // Rating distribution
  const ratingDistribution = {
    5: approvedReviews.filter(r => r.rating === 5).length,
    4: approvedReviews.filter(r => r.rating === 4).length,
    3: approvedReviews.filter(r => r.rating === 3).length,
    2: approvedReviews.filter(r => r.rating === 2).length,
    1: approvedReviews.filter(r => r.rating === 1).length,
  };
  
  return {
    total: allReviews.length,
    approved: approvedReviews.length,
    featured: featuredReviews.length,
    pending: pendingReviews.length,
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    ratingDistribution,
  };
}

/**
 * Get reviews by rating
 */
export async function getReviewsByRating(
  ctx: QueryCtx,
  rating: number,
  limit: number = 50
) {
  return await ctx.db
      .query("reviews")
      .withIndex("by_rating", (q) => q.eq("rating", rating))
      .filter((q) => q.eq(q.field("isApproved"), true))
      .order("desc")
      .take(limit);
}

/**
 * Check if user has access to admin functions
 */
export async function checkAdminAccess(ctx: QueryCtx | MutationCtx): Promise<{ userId: string; role: string }> {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  if (user.role !== "admin") {
    throw new Error("Only admins can perform this action");
  }
  
  return { userId: user.userId || "", role: user.role || "" };
}

/**
 * Log review-related activity
 */
async function logReviewActivity(
  ctx: MutationCtx,
  action: string,
  reviewId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  try {
    await ctx.db.insert("activityLog", {
      action,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        reviewId,
      },
    });
  } catch (error) {
    // Log activity failures shouldn't break the main operation
    console.error("Failed to log review activity:", error);
  }
}

/**
 * Validate review data using Convex validators
 */
export const reviewDataValidator = v.object({
  customerName: v.string(),
  rating: v.number(),
  comment: v.string(),
  serviceId: v.string(),
  isApproved: v.optional(v.boolean()),
  isFeatured: v.optional(v.boolean()),
  date: v.optional(v.string()),
});