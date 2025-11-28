import { internalQuery, internalMutation, query, mutation } from "../_generated/server";
import { v } from "convex/values";
import {
  getActiveServices,
  getServicesWithFilters,
  getServicesByCategory,
  getServiceById,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  getServiceStats,
  checkAdminAccess,
  serviceDataValidator,
  type ServiceData
} from "../model/services";

/**
 * PUBLIC API FUNCTIONS (Following Convex Best Practices)
 * These functions have proper validation and access control
 */

// Get all active services for public display
export const getActiveServicesPublic = query({
  args: {},
  handler: async (ctx) => {
    return await getActiveServices(ctx);
  },
});

// Get services with filtering (public read access)
export const getServicesFiltered = query({
  args: {
    category: v.optional(v.union(v.literal("primary"), v.literal("additional"))),
    isActive: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await getServicesWithFilters(ctx, args);
  },
});

// Get service by slug (public read access)
export const getServiceBySlugPublic = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    const service = await getServiceBySlug(ctx, slug);
    if (!service) {
      throw new Error("Service not found");
    }
    return service;
  },
});

// Get service by ID (public read access)
export const getServiceByIdPublic = query({
  args: {
    serviceId: v.string(),
  },
  handler: async (ctx, { serviceId }) => {
    const service = await getServiceById(ctx, serviceId);
    if (!service) {
      throw new Error("Service not found");
    }
    return service;
  },
});

/**
 * ADMIN API FUNCTIONS (Restricted Access)
 * These functions require admin authentication
 */

// Get all services with admin-level data
export const getAllServicesAdmin = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    await checkAdminAccess(ctx);
    return await getServicesWithFilters(ctx, { limit });
  },
});

// Create new service (admin only)
export const createServiceAdmin = mutation({
  args: serviceDataValidator,
  handler: async (ctx, serviceData) => {
    await checkAdminAccess(ctx);
    return await createService(ctx, serviceData as ServiceData);
  },
});

// Update service (admin only)
export const updateServiceAdmin = mutation({
  args: {
    serviceId: v.string(),
    updates: serviceDataValidator,
  },
  handler: async (ctx, { serviceId, updates }) => {
    await checkAdminAccess(ctx);
    await updateService(ctx, serviceId, updates as Partial<ServiceData>);
    return { success: true };
  },
});

// Delete service (admin only)
export const deleteServiceAdmin = mutation({
  args: {
    serviceId: v.string(),
  },
  handler: async (ctx, { serviceId }) => {
    await checkAdminAccess(ctx);
    await deleteService(ctx, serviceId);
    return { success: true };
  },
});

// Toggle service status (admin only)
export const toggleServiceStatusAdmin = mutation({
  args: {
    serviceId: v.string(),
  },
  handler: async (ctx, { serviceId }) => {
    await checkAdminAccess(ctx);
    return await toggleServiceStatus(ctx, serviceId);
  },
});

// Get service statistics (admin only)
export const getServiceStatsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await checkAdminAccess(ctx);
    return await getServiceStats(ctx);
  },
});

/**
 * SERVICE CATEGORY QUERIES (Public Access)
 */

// Get services by category with active filter
export const getServicesByCategoryPublic = query({
  args: {
    category: v.union(v.literal("primary"), v.literal("additional")),
  },
  handler: async (ctx, { category }) => {
    return await getServicesByCategory(ctx, category);
  },
});
