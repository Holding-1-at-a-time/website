import { query, mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { 
  validateServiceData,
  sanitizeInput 
} from "../validators";
import { 
  getCurrentUser, 
  logActivity,
  handleConvexError 
} from "../auth";

// Get all services with optional filtering
export const getServices = query(async (ctx, args: any = {}) => {
  try {
    let query = ctx.db.query("services");

    // Apply filters using filter instead of withIndex for now
    if (args.category) {
      query = query.filter((q: any) => q.eq(q.field("category"), args.category));
    }
    
    if (args.isActive !== undefined) {
      query = query.filter((q: any) => q.eq(q.field("isActive"), args.isActive));
    }

    // Order by sort order, then by name
    const services = await query
      .order("asc")
      .collect();

    return services;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get services by category
export const getServicesByCategory = query(async (ctx, { 
  category 
}: { 
  category: "primary" | "additional" 
}) => {
  try {
    const services = await ctx.db
      .query("services")
      .filter((q: any) => 
        q.and(
          q.eq(q.field("category"), category),
          q.eq(q.field("isActive"), true)
        )
      )
      .order("asc")
      .collect();

    return services;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get active services for public display
export const getActiveServices = query(async (ctx) => {
  try {
    const services = await ctx.db
      .query("services")
      .filter((q: any) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();

    return services;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get service by ID
export const getServiceById = query(async (ctx, { serviceId }: { serviceId: string }) => {
  try {
    const service = await ctx.db.get(serviceId as any);
    
    if (!service) {
      throw new ConvexError("Service not found");
    }

    return service;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get service by slug
export const getServiceBySlug = query(async (ctx, { slug }: { slug: string }) => {
  try {
    const services = await ctx.db
      .query("services")
      .filter((q: any) => q.eq(q.field("slug"), slug))
      .collect();

    if (services.length === 0) {
      throw new ConvexError("Service not found");
    }

    return services[0];
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Create new service (Admin only)
export const createService = mutation(async (ctx, serviceData: any) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can create services");
    }

    // Validate and sanitize data
    const validation = validateServiceData(serviceData);
    if (!validation.isValid) {
      throw new ConvexError(validation.errors.join(", "));
    }

    const sanitizedData = {
      name: sanitizeInput(serviceData.name),
      slug: sanitizeInput(serviceData.slug),
      category: serviceData.category,
      title: sanitizeInput(serviceData.title),
      description: sanitizeInput(serviceData.description),
      metaDescription: sanitizeInput(serviceData.metaDescription),
      features: serviceData.features?.map((f: string) => sanitizeInput(f)) || [],
      benefits: serviceData.benefits?.map((b: string) => sanitizeInput(b)) || [],
      price: sanitizeInput(serviceData.price),
      duration: sanitizeInput(serviceData.duration),
      process: serviceData.process?.map((p: any) => ({
        step: p.step,
        title: sanitizeInput(p.title),
        description: sanitizeInput(p.description),
      })) || [],
      isActive: serviceData.isActive ?? true,
      sortOrder: serviceData.sortOrder || 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Check if slug already exists
    const existingServices = await ctx.db
      .query("services")
      .filter((q: any) => q.eq(q.field("slug"), sanitizedData.slug))
      .collect();

    if (existingServices.length > 0) {
      throw new ConvexError("A service with this slug already exists");
    }

    // Create the service
    const serviceId = await ctx.db.insert("services", sanitizedData);

    await logActivity(ctx, "service_created", {
      userId: user.userId,
      changes: `Created service: ${sanitizedData.name}`,
    });

    return serviceId;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Update service (Admin only)
export const updateService = mutation(async (ctx, { 
  serviceId, 
  updates 
}: { 
  serviceId: string; 
  updates: any 
}) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can update services");
    }

    // Get existing service
    const existingService = await ctx.db.get(serviceId as any);
    if (!existingService) {
      throw new ConvexError("Service not found");
    }

    // Prepare updates
    const updateData: any = {
      updatedAt: Date.now(),
    };

    // Only update provided fields
    if (updates.name !== undefined) {
      const nameValidation = validateServiceData({ name: updates.name, ...existingService });
      if (!nameValidation.isValid) {
        throw new ConvexError(nameValidation.errors.join(", "));
      }
      updateData.name = sanitizeInput(updates.name);
    }

    if (updates.slug !== undefined && updates.slug !== existingService.slug) {
      // Check if new slug already exists
      const existingServices = await ctx.db
        .query("services")
        .filter((q: any) => q.eq(q.field("slug"), updates.slug))
        .collect();

      if (existingServices.length > 0 && existingServices[0]._id !== serviceId) {
        throw new ConvexError("A service with this slug already exists");
      }
      updateData.slug = sanitizeInput(updates.slug);
    }

    if (updates.price !== undefined) {
      updateData.price = sanitizeInput(updates.price);
    }

    if (updates.description !== undefined) {
      updateData.description = sanitizeInput(updates.description);
    }

    if (updates.features !== undefined) {
      updateData.features = updates.features.map((f: string) => sanitizeInput(f));
    }

    if (updates.benefits !== undefined) {
      updateData.benefits = updates.benefits.map((b: string) => sanitizeInput(b));
    }

    if (updates.isActive !== undefined) {
      updateData.isActive = updates.isActive;
    }

    if (updates.sortOrder !== undefined) {
      updateData.sortOrder = updates.sortOrder;
    }

    // Update the service
    await ctx.db.patch(serviceId as any, updateData);

    await logActivity(ctx, "service_updated", {
      userId: user.userId,
      bookingId: undefined,
      changes: `Updated service: ${existingService.name}`,
    });

    return serviceId;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Delete service (Admin only)
export const deleteService = mutation(async (ctx, { serviceId }: { serviceId: string }) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can delete services");
    }

    // Get existing service
    const existingService = await ctx.db.get(serviceId as any);
    if (!existingService) {
      throw new ConvexError("Service not found");
    }

    // Check if service has associated bookings
    const associatedBookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("serviceId"), serviceId))
      .collect();

    if (associatedBookings.length > 0) {
      throw new ConvexError("Cannot delete service with existing bookings. Set isActive to false instead.");
    }

    // Delete the service
    await ctx.db.delete(serviceId as any);

    await logActivity(ctx, "service_deleted", {
      userId: user.userId,
      changes: `Deleted service: ${existingService.name}`,
    });

    return true;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Toggle service active status (Admin only)
export const toggleServiceStatus = mutation(async (ctx, { serviceId }: { serviceId: string }) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can toggle service status");
    }

    // Get existing service
    const existingService = await ctx.db.get(serviceId as any);
    if (!existingService) {
      throw new ConvexError("Service not found");
    }

    // Toggle status
    const newStatus = !existingService.isActive;
    await ctx.db.patch(serviceId as any, {
      isActive: newStatus,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, "service_status_toggled", {
      userId: user.userId,
      changes: `${newStatus ? "Activated" : "Deactivated"} service: ${existingService.name}`,
    });

    return { serviceId, isActive: newStatus };
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get service statistics (Admin only)
export const getServiceStats = query(async (ctx) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can view service statistics");
    }

    const allServices = await ctx.db.query("services").collect();
    const activeServices = allServices.filter(s => s.isActive);
    const inactiveServices = allServices.filter(s => !s.isActive);

    // Get booking counts for each service
    const serviceBookingStats = await Promise.all(
      activeServices.map(async (service) => {
        const bookings = await ctx.db
          .query("bookings")
          .filter((q: any) => q.eq(q.field("serviceId"), service._id))
          .collect();

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
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});
