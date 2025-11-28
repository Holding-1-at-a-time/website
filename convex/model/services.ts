import { MutationCtx, QueryCtx } from "../_generated/server";
import { v } from "convex/values";

/**
 * Service business logic - separated from API functions
 * These functions contain the core business logic and can be called from both 
 * internal and public Convex functions
 */

export interface ServiceData {
  name: string;
  slug: string;
  category: "primary" | "additional";
  title: string;
  description: string;
  metaDescription: string;
  features: string[];
  benefits: string[];
  price: string;
  duration: string;
  process: Array<{ step: number; title: string; description: string }>;
  isActive?: boolean;
  sortOrder?: number;
}

/**
 * Get all active services for public display
 * Using proper indexing and limiting as per Convex best practices
 */
export async function getActiveServices(ctx: QueryCtx) {
  const services = await ctx.db
    .query("services")
    .withIndex("by_isActive", (q) => q.eq("isActive", true))
    .order("asc")
    .take(100); // Limit results to prevent large collections
  
  return services;
}

/**
 * Get all services with optional filtering
 * Uses proper indexes for performance
 */
export async function getServicesWithFilters(
  ctx: QueryCtx, 
  filters: { category?: "primary" | "additional"; isActive?: boolean; limit?: number }
) {
  let query = ctx.db.query("services");
  
  // Apply category filter using index
  if (filters.category) {
    query = query.withIndex("by_category", (q) => q.eq("category", filters.category));
  }
  
  // Apply active status filter
  if (filters.isActive !== undefined) {
    query = query.withIndex("by_isActive", (q) => q.eq("isActive", filters.isActive));
  }
  
  const limit = filters.limit || 50; // Default limit to prevent large results
  const services = await query.order("asc").take(limit);
  
  return services;
}

/**
 * Get services by category using compound index
 */
export async function getServicesByCategory(
  ctx: QueryCtx, 
  category: "primary" | "additional"
) {
  const services = await ctx.db
    .query("services")
    .withIndex("by_category_and_active", (q) => 
      q.eq("category", category).eq("isActive", true)
    )
    .order("asc")
    .take(100); // Limit results
  
  return services;
}

/**
 * Get service by ID with validation
 */
export async function getServiceById(ctx: QueryCtx, serviceId: string) {
  const service = await ctx.db.get(serviceId as any);
  return service;
}

/**
 * Get service by slug using index
 */
export async function getServiceBySlug(ctx: QueryCtx, slug: string) {
  const services = await ctx.db
    .query("services")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .take(1);
  
  return services.length > 0 ? services[0] : null;
}

/**
 * Create a new service
 */
export async function createService(
  ctx: MutationCtx, 
  serviceData: ServiceData
): Promise<string> {
  // Check for existing slug
  const existingServices = await ctx.db
    .query("services")
    .withIndex("by_slug", (q) => q.eq("slug", serviceData.slug))
    .take(1);

  if (existingServices.length > 0) {
    throw new Error("A service with this slug already exists");
  }

  const serviceId = await ctx.db.insert("services", {
    ...serviceData,
    isActive: serviceData.isActive ?? true,
    sortOrder: serviceData.sortOrder ?? 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return serviceId;
}

/**
 * Update an existing service
 */
export async function updateService(
  ctx: MutationCtx,
  serviceId: string,
  updates: Partial<ServiceData>
): Promise<void> {
  // Get existing service
  const existingService = await ctx.db.get(serviceId as any);
  if (!existingService) {
    throw new Error("Service not found");
  }

  // If updating slug, check for conflicts
  if (updates.slug && updates.slug !== existingService.slug) {
    const existingServices = await ctx.db
      .query("services")
      .withIndex("by_slug", (q) => q.eq("slug", updates.slug))
      .take(1);

    if (existingServices.length > 0) {
      throw new Error("A service with this slug already exists");
    }
  }

  // Prepare update data
  const updateData: any = {
    updatedAt: Date.now(),
  };

  // Only update provided fields
  if (updates.name !== undefined) updateData.name = updates.name;
  if (updates.slug !== undefined) updateData.slug = updates.slug;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.metaDescription !== undefined) updateData.metaDescription = updates.metaDescription;
  if (updates.features !== undefined) updateData.features = updates.features;
  if (updates.benefits !== undefined) updateData.benefits = updates.benefits;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.duration !== undefined) updateData.duration = updates.duration;
  if (updates.process !== undefined) updateData.process = updates.process;
  if (updates.isActive !== undefined) updateData.isActive = updates.isActive;
  if (updates.sortOrder !== undefined) updateData.sortOrder = updates.sortOrder;
  if (updates.category !== undefined) updateData.category = updates.category;

  await ctx.db.patch(serviceId as any, updateData);
}

/**
 * Delete a service (check for associated bookings first)
 */
export async function deleteService(
  ctx: MutationCtx,
  serviceId: string
): Promise<void> {
  // Check if service has associated bookings
  const associatedBookings = await ctx.db
    .query("bookings")
    .withIndex("by_serviceId", (q) => q.eq("serviceId", serviceId as any))
    .take(1); // Just check if any exist

  if (associatedBookings.length > 0) {
    throw new Error("Cannot delete service with existing bookings. Set isActive to false instead.");
  }

  await ctx.db.delete(serviceId as any);
}

/**
 * Toggle service active status
 */
export async function toggleServiceStatus(
  ctx: MutationCtx,
  serviceId: string
): Promise<{ serviceId: string; isActive: boolean }> {
  // Get existing service
  const existingService = await ctx.db.get(serviceId as any);
  if (!existingService) {
    throw new Error("Service not found");
  }

  // Toggle status
  const newStatus = !existingService.isActive;
  await ctx.db.patch(serviceId as any, {
    isActive: newStatus,
    updatedAt: Date.now(),
  });

  return { serviceId, isActive: newStatus };
}

/**
 * Get service statistics for admin dashboard
 * Uses efficient queries with limits
 */
export async function getServiceStats(ctx: QueryCtx) {
  const allServices = await ctx.db
    .query("services")
    .take(1000); // Reasonable limit for statistics

  const activeServices = allServices.filter(s => s.isActive);
  const inactiveServices = allServices.filter(s => !s.isActive);

  // Get booking counts for each service using efficient queries with limits
  const serviceBookingStats = await Promise.all(
    activeServices.slice(0, 100).map(async (service) => {
      const bookings = await ctx.db
        .query("bookings")
        .withIndex("by_serviceId", (q) => q.eq("serviceId", service._id))
        .take(1000); // Reasonable limit

      return {
        serviceId: service._id,
        serviceName: service.name,
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === "confirmed").length,
        pendingBookings: bookings.filter(b => b.status === "pending").length,
      };
    })
  );

  return {
    totalServices: allServices.length,
    activeServices: activeServices.length,
    inactiveServices: inactiveServices.length,
    services: serviceBookingStats,
  };
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
 * Validate service data using Convex validators
 */
export const serviceDataValidator = v.object({
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
  isActive: v.optional(v.boolean()),
  sortOrder: v.optional(v.number()),
});
