import { internalQuery, internalMutation, query, mutation } from "../_generated/server";
import { v } from "convex/values";
import {
  getApprovedReviews,
  getFeaturedReviews,
  getReviewsByService,
  getAllReviews,
  getPendingReviews,
  getReviewById,
  createReview,
  approveReview,
  rejectReview,
  toggleFeaturedReview,
  updateReview,
  getReviewStats,
  getReviewsByRating,
  checkAdminAccess,
  reviewDataValidator,
  type ReviewData
} from "../model/reviews";

/**
 * PUBLIC API FUNCTIONS (Following Convex Best Practices)
 * These functions have proper validation and appropriate access control
 */

// Get approved reviews for public display
export const getApprovedReviewsPublic = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    return await getApprovedReviews(ctx, limit || 20);
  },
});

// Get featured reviews for homepage
export const getFeaturedReviewsPublic = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    return await getFeaturedReviews(ctx, limit || 6);
  },
});

// Get reviews by service ID (public access to approved reviews)
export const getReviewsByServicePublic = query({
  args: {
    serviceId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { serviceId, limit }) => {
    return await getReviewsByService(ctx, serviceId, true, limit || 50);
  },
});

// Get reviews by rating (public access)
export const getReviewsByRatingPublic = query({
  args: {
    rating: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { rating, limit }) => {
    // Validate rating range
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    return await getReviewsByRating(ctx, rating, limit || 50);
  },
});

// Create a new review (public access)
export const createReviewPublic = mutation({
  args: reviewDataValidator,
  handler: async (ctx, reviewData) => {
    // Add basic rate limiting for review submissions
    const recentReviews = await ctx.db
      .query("reviews")
      .filter((q) =>
        q.eq(q.field("customerName"), reviewData.customerName)
      )
      .order("desc")
      .take(1);

    if (recentReviews.length > 0) {
      const lastReview = recentReviews[0];
      const timeDiff = Date.now() - lastReview._creationTime;
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (timeDiff < oneDay) {
        throw new Error("You can only submit one review per day. Please try again tomorrow.");
      }
    }

    const reviewId = await createReview(ctx, reviewData as ReviewData);
    return {
      reviewId,
      message: "Thank you for your review! It will be reviewed by our team before appearing on our website."
    };
  },
});

// Get review by ID (limited access)
export const getReviewByIdPublic = query({
  args: {
    reviewId: v.string(),
  },
  handler: async (ctx, { reviewId }) => {
    const review = await getReviewById(ctx, reviewId);
    if (!review) {
      throw new Error("Review not found");
    }

    // Only return approved reviews to public
    if (!review || (typeof review === "object" && "isApproved" in review && !review.isApproved)) {
      throw new Error("Review not available");
    }

    return review;
  },
});

/**
 * ADMIN API FUNCTIONS (Restricted Access)
 * These functions require admin authentication
 */

// Get all reviews for admin (including unapproved)
export const getAllReviewsAdmin = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    await checkAdminAccess(ctx);
    return await getAllReviews(ctx, limit || 100);
  },
});

// Get pending reviews for admin approval
export const getPendingReviewsAdmin = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    await checkAdminAccess(ctx);
    return await getPendingReviews(ctx, limit || 50);
  },
});

// Approve a review
export const approveReviewAdmin = mutation({
  args: {
    reviewId: v.string(),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, { reviewId, isFeatured }) => {
    await checkAdminAccess(ctx);
    await approveReview(ctx, reviewId, isFeatured || false);
    return {
      success: true,
      message: `Review approved${isFeatured ? " and featured" : ""} successfully`
    };
  },
});

// Reject/delete a review
export const rejectReviewAdmin = mutation({
  args: {
    reviewId: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { reviewId, reason }) => {
    await checkAdminAccess(ctx);
    await rejectReview(ctx, reviewId, reason);
    return { success: true, message: "Review rejected and removed" };
  },
});

// Toggle featured status
export const toggleFeaturedReviewAdmin = mutation({
  args: {
    reviewId: v.string(),
  },
  handler: async (ctx, { reviewId }) => {
    await checkAdminAccess(ctx);
    const result = await toggleFeaturedReview(ctx, reviewId);
    return {
      success: true,
      message: `Review ${result.isFeatured ? "featured" : "unfeatured"} successfully`,
      isFeatured: result.isFeatured
    };
  },
});

// Update review content (admin only)
export const updateReviewAdmin = mutation({
  args: {
    reviewId: v.string(),
    updates: v.object({
      comment: v.optional(v.string()),
      rating: v.optional(v.number()),
    }),
  },
  handler: async (ctx, { reviewId, updates }) => {
    await checkAdminAccess(ctx);

    // Validate rating if provided
    if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error("Rating must be between 1 and 5 stars");
    }

    await updateReview(ctx, reviewId, updates);
    return { success: true, message: "Review updated successfully" };
  },
});

// Get review statistics (admin only)
export const getReviewStatsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await checkAdminAccess(ctx);
    return await getReviewStats(ctx);
  },
});

// Bulk approve multiple reviews
export const bulkApproveReviewsAdmin = mutation({
  args: {
    reviewIds: v.array(v.string()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, { reviewIds, isFeatured }) => {
    await checkAdminAccess(ctx);

    const results = [];
    for (const reviewId of reviewIds) {
      try {
        await approveReview(ctx, reviewId, isFeatured || false);
        results.push({ reviewId, success: true });
      } catch (error) {
        results.push({
          reviewId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: true,
      message: `Approved ${successCount} of ${reviewIds.length} reviews`,
      results
    };
  },
});

// Bulk reject multiple reviews
export const bulkRejectReviewsAdmin = mutation({
  args: {
    reviewIds: v.array(v.string()),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { reviewIds, reason }) => {
    await checkAdminAccess(ctx);

    const results = [];
    for (const reviewId of reviewIds) {
      try {
        await rejectReview(ctx, reviewId, reason);
        results.push({ reviewId, success: true });
      } catch (error) {
        results.push({
          reviewId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: true,
      message: `Rejected ${successCount} of ${reviewIds.length} reviews`,
      results
    };
  },
});

// Get reviews by service for admin (including unapproved)
export const getAllReviewsByServiceAdmin = query({
  args: {
    serviceId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { serviceId, limit }) => {
    await checkAdminAccess(ctx);
    return await getReviewsByService(ctx, serviceId, false, limit || 100);
  },
});

// Set featured status for multiple reviews
export const bulkFeatureReviewsAdmin = mutation({
  args: {
    reviewIds: v.array(v.string()),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, { reviewIds, isFeatured }) => {
    await checkAdminAccess(ctx);

    const results = [];
    for (const reviewId of reviewIds) {
      try {
        const review = await getReviewById(ctx, reviewId);
        if (!review) {
          results.push({ reviewId, success: false, error: "Review not found" });
          continue;
        }

        if (!('isApproved' in review) || !review.isApproved) {
          results.push({ reviewId, success: false, error: "Review not approved" });
          continue;
        }

        await ctx.db.patch(reviewId as any, {
          isFeatured: isFeatured,
          updatedAt: Date.now(),
        });

        results.push({ reviewId, success: true });
      } catch (error) {
        results.push({
          reviewId,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return {
      success: true,
      message: `${isFeatured ? "Featured" : "Unfeatured"} ${successCount} of ${reviewIds.length} reviews`,
      results
    };
  },
});
