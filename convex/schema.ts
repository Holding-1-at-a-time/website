import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Services collection - Dynamic service management
  services: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.union(v.literal("primary"), v.literal("additional")),
    title: v.string(),
    description: v.string(),
    metaDescription: v.string(),
    features: v.array(v.string()),
    benefits: v.array(v.string()),
    price: v.string(),
    duration: v.string(),
    process: v.array(v.object({
      step: v.number(),
      title: v.string(),
      description: v.string(),
    })),
    isActive: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"])
   .index("by_isActive", ["isActive"])
   .index("by_slug", ["slug"])
   .index("by_category_and_active", ["category", "isActive"])
   .index("by_sort_order", ["sortOrder"]),

  // Bookings collection - Core booking management
  bookings: defineTable({
    // Customer Information (Guest bookings - no registration required)
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    
    // Booking Details
    serviceId: v.id("services"),
    preferredDate: v.string(), // ISO date string (YYYY-MM-DD)
    preferredTime: v.string(), // Time format (HH:MM AM/PM)
    vehicleType: v.union(
      v.literal("sedan"),
      v.literal("suv"),
      v.literal("truck"),
      v.literal("van"),
      v.literal("coupe"),
      v.literal("sports")
    ),
    message: v.optional(v.string()),
    
    // Booking Status Management
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    
    // Timestamps for workflow tracking
    createdAt: v.number(),
    updatedAt: v.number(),
    confirmedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
  }).index("by_status", ["status"])
   .index("by_date", ["preferredDate"])
   .index("by_created", ["createdAt"])
   .index("by_customer_email", ["customerEmail"])
   .index("by_serviceId", ["serviceId"])
   .index("by_service_date", ["serviceId", "preferredDate"])
   .index("by_status_date", ["status", "preferredDate"]),

  // Reviews collection - Customer feedback management
  reviews: defineTable({
    customerName: v.string(),
    rating: v.number(), // 1-5 stars
    comment: v.string(),
    serviceId: v.id("services"),
    isApproved: v.boolean(),
    isFeatured: v.boolean(),
    date: v.string(), // ISO date string
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_approved", ["isApproved"])
   .index("by_service", ["serviceId"])
   .index("by_rating", ["rating"])
   .index("by_created", ["createdAt"]),

  // Customers collection - Customer relationship management
  customers: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    })),
    vehicleInfo: v.optional(v.array(v.object({
      type: v.string(),
      make: v.string(),
      model: v.string(),
      year: v.number(),
    }))),
    totalBookings: v.number(),
    lastBookingDate: v.optional(v.number()),
    isActive: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"])
   .index("by_phone", ["phone"])
   .index("by_created", ["createdAt"]),

  // Admin users collection - Admin access control
  adminUsers: defineTable({
    userId: v.string(), // Convex auth user ID
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("staff")
    ),
    permissions: v.array(v.string()),
    lastLoginAt: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"])
   .index("by_email", ["email"])
   .index("by_role", ["role"]),

  // Business settings collection - Configuration management
  businessSettings: defineTable({
    key: v.string(),
    value: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.id("adminUsers"),
  }).index("by_key", ["key"]),

  // Activity log collection - Audit trail
  activityLog: defineTable({
    action: v.string(),
    userId: v.optional(v.string()),
    bookingId: v.optional(v.id("bookings")),
    customerEmail: v.optional(v.string()),
    timestamp: v.number(),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      changes: v.optional(v.string()),
    })),
  }).index("by_timestamp", ["timestamp"])
   .index("by_booking", ["bookingId"])
   .index("by_user", ["userId"]),

  // Sessions collection - Session management for security
  sessions: defineTable({
    sessionId: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    lastAccessed: v.number(),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
    })),
  }).index("by_session_id", ["sessionId"])
   .index("by_user_id", ["userId"])
   .index("by_expires", ["expiresAt"]),
});
