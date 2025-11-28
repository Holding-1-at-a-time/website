import { MutationCtx, QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { BookingData, BookingFilters, BookingUpdateData } from "../types";

/**
 * Booking business logic - separated from API functions
 * These functions contain the core business logic and can be called from both
 * internal and public Convex functions
 */

/**
 * Get booking by ID with validation
 */
export async function getBookingById(ctx: QueryCtx, bookingId: string): Promise<BookingData | null> {
  try {
    const booking = await ctx.db.get(bookingId as any);
    return booking as BookingData | null;
  } catch (error) {
    console.error("Error getting booking:", error);
    return null;
  }
}

/**
 * Get bookings with filtering (public access for customer's own bookings)
 */
export async function getBookingsWithFilters(
  ctx: QueryCtx,
  filters: BookingFilters
): Promise<BookingData[]> {
  let query = ctx.db.query("bookings");
  
  // Filter by customer email (for customer access to their own bookings)
  if (filters.customerEmail) {
    query = query.withIndex("by_customer_email", (q) =>
      q.eq("customerEmail", filters.customerEmail!)
    );
  }
  
  // Filter by status
  if (filters.status) {
    query = query.withIndex("by_status", (q) => q.eq("status", filters.status));
  }
  
  const limit = filters.limit || 50;
  const bookings = await query.order("desc").take(limit);
  
  return bookings as BookingData[];
}

/**
 * Get bookings by service ID (for admin/service analytics)
 */
export async function getBookingsByService(
  ctx: QueryCtx,
  serviceId: string,
  limit: number = 100
): Promise<BookingData[]> {
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_serviceId", (q) => q.eq("serviceId", serviceId as any))
    .order("desc")
    .take(limit);
  
  return bookings as BookingData[];
}

/**
 * Get bookings by date range (for calendar view)
 */
export async function getBookingsByDateRange(
  ctx: QueryCtx,
  startDate: string,
  endDate: string,
  limit: number = 1000
): Promise<BookingData[]> {
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_date", (q) =>
      q.gte("preferredDate", startDate).lte("preferredDate", endDate)
    )
    .order("asc")
    .take(limit);
  
  return bookings as BookingData[];
}

/**
 * Get today's bookings (for admin dashboard)
 */
export async function getTodaysBookings(ctx: QueryCtx): Promise<BookingData[]> {
  const today = new Date().toISOString().split('T')[0];
  
  const bookings = await ctx.db
    .query("bookings")
    .withIndex("by_date", (q) => q.eq("preferredDate", today))
    .order("asc")
    .take(100);
  
  return bookings as BookingData[];
}

/**
 * Check for booking conflicts (same date and time)
 */
export async function checkBookingConflict(
  const conflictingBookings = await ctx.db
    .query("bookings")
    .withIndex("by_date", (q) => q.eq("preferredDate", date))
    .filter((q) => q.eq(q.field("preferredTime"), time))
    .take(50);
  
  // Filter out cancelled/completed bookings and the booking being updated
  const activeConflicts = conflictingBookings.filter(b => 
    b._id !== excludeBookingId && 
    !["cancelled", "completed"].includes(b.status)
  );
  
  return activeConflicts.length > 0;
  const activeConflicts = excludeBookingId
    ? conflictingBookings.filter(b => b._id !== excludeBookingId)
    : conflictingBookings;
  
  return activeConflicts.length > 0;
}

/**
 * Create a new booking with conflict detection
 */
export async function createBooking(
  ctx: MutationCtx,
  bookingData: BookingData
): Promise<string> {
  // Check for booking conflicts
  const hasConflict = await checkBookingConflict(
    ctx,
    bookingData.preferredDate,
    bookingData.preferredTime
  );
  
  if (hasConflict) {
    throw new Error("This time slot is already booked. Please choose another time.");
  }
  
  // Validate that the service exists
  const service = await ctx.db.get(bookingData.serviceId);
  if (!service) {
    throw new Error("Selected service not found");
  }
  
  const bookingId = await ctx.db.insert("bookings", {
    customerName: bookingData.customerName,
    customerEmail: bookingData.customerEmail,
    customerPhone: bookingData.customerPhone,
    serviceId: bookingData.serviceId,
    preferredDate: bookingData.preferredDate,
    preferredTime: bookingData.preferredTime,
    vehicleType: bookingData.vehicleType,
    message: bookingData.message || "",
    status: bookingData.status || "pending",
    notes: bookingData.notes || "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  
  // Log the booking creation
  await logBookingActivity(ctx, "booking_created", bookingId, {
    customerEmail: bookingData.customerEmail,
    serviceId: bookingData.serviceId,
    preferredDate: bookingData.preferredDate,
    preferredTime: bookingData.preferredTime,
  });
  
  return bookingId;
}

/**
 * Update an existing booking
 */
export async function updateBooking(
  ctx: MutationCtx,
  bookingId: string,
  updates: BookingUpdateData
): Promise<void> {
  // Get existing booking
  const existingBooking = await ctx.db.get(bookingId);
  if (!existingBooking) {
    throw new Error("Booking not found");
  }
  
  // If updating date/time, check for conflicts
  if (updates.preferredDate || updates.preferredTime) {
    const newDate = updates.preferredDate || existingBooking.preferredDate;
    const newTime = updates.preferredTime || existingBooking.preferredTime;
    
    const hasConflict = await checkBookingConflict(
      ctx,
      newDate,
      newTime,
      bookingId
    );
    
    if (hasConflict) {
      throw new Error("This time slot is already booked. Please choose another time.");
    }
  }
  
  // If updating serviceId, validate the service exists
  if (updates.serviceId && updates.serviceId !== existingBooking.serviceId) {
  // Spread updates first, then apply server-controlled timestamps
  const updateData: BookingUpdateData = {
    ...updates,
    updatedAt: Date.now(),
    ...(updates.status === "confirmed" && { confirmedAt: Date.now() }),
    ...(updates.status === "completed" && { completedAt: Date.now() }),
    ...(updates.status === "cancelled" && { cancelledAt: Date.now() }),
  };
    updateData.confirmedAt = Date.now();
  } else if (updates.status === "completed") {
    updateData.completedAt = Date.now();
  } else if (updates.status === "cancelled") {
    updateData.cancelledAt = Date.now();
  }
  
  await ctx.db.patch(bookingId, updateData);
  
  // Log the booking update
  await logBookingActivity(ctx, "booking_updated", bookingId, {
    customerEmail: existingBooking.customerEmail,
    changes: Object.keys(updates).join(", "),
  });
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  ctx: MutationCtx,
  bookingId: string,
  reason?: string
): Promise<void> {
  // Get existing booking
  const existingBooking = await ctx.db.get(bookingId);
  if (!existingBooking) {
    throw new Error("Booking not found");
  }
  
  if (existingBooking.status === "cancelled") {
    throw new Error("Booking is already cancelled");
  }
  
  await ctx.db.patch(bookingId, {
    status: "cancelled" as const,
    cancelledAt: Date.now(),
    notes: reason ? `${existingBooking.notes || ""}\nCancellation reason: ${reason}`.trim() : existingBooking.notes,
    updatedAt: Date.now(),
  });
  
  // Log the cancellation
  await logBookingActivity(ctx, "booking_cancelled", bookingId, {
    customerEmail: existingBooking.customerEmail,
    reason: reason || "No reason provided",
  });
}

/**
 * Get booking statistics for admin dashboard
 */
export async function getBookingStats(ctx: QueryCtx) {
  // Get all bookings with reasonable limit for statistics
  const allBookings = await ctx.db
    .query("bookings")
    .take(5000); // Reasonable limit for statistics
  
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = allBookings.filter(b => b.preferredDate === today);
  
  const statusCounts = {
    pending: allBookings.filter(b => b.status === "pending").length,
    confirmed: allBookings.filter(b => b.status === "confirmed").length,
    in_progress: allBookings.filter(b => b.status === "in_progress").length,
    completed: allBookings.filter(b => b.status === "completed").length,
    cancelled: allBookings.filter(b => b.status === "cancelled").length,
  };
  
  return {
    total: allBookings.length,
    today: todayBookings.length,
    pending: statusCounts.pending,
    confirmed: statusCounts.confirmed,
    in_progress: statusCounts.in_progress,
    completed: statusCounts.completed,
    cancelled: statusCounts.cancelled,
export async function getAvailableTimeSlots(
  ctx: QueryCtx,
  date: string,
  _serviceId?: string // Mark unused or implement service-specific logic
): Promise<string[]> {
  // Get existing bookings for the date
  const existingBookings = await ctx.db
    .query("bookings")
    .withIndex("by_date", (q) => q.eq("preferredDate", date))
    .filter((q) => q.neq(q.field("status"), "cancelled"))
    .take(100);
  
  const bookedTimes = existingBookings.map(b => b.preferredTime);
  
  // Define business hours (9 AM to 6 PM)
  const businessHours = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];
  
  // Return available slots (not booked)
  return businessHours.filter(time => !bookedTimes.includes(time));
}
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];
  
  // Return available slots (not booked)
  return businessHours.filter(time => !bookedTimes.includes(time));
}
/**
 * Check if user has access to admin functions
 */
export async function checkAdminAccess(
  ctx: QueryCtx | MutationCtx
): Promise<{ userId: string; role: string }> {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  if (user.role !== "admin") {
    throw new Error("Only admins can perform this action");
  }
  
  // Ensure userId and role are strings for consistent return type
  const userId = typeof user.userId === 'string' ? user.userId : '';
  const role = typeof user.role === 'string' ? user.role : '';
  
  return { userId, role };
}

/**
 * Log booking-related activity
 */
async function logBookingActivity(
  ctx: MutationCtx,
  action: string,
  bookingId: string,
  metadata: Record<string, unknown>
): Promise<void> {
  try {
    await ctx.db.insert("activityLog", {
      action,
      bookingId: bookingId as any,
      timestamp: Date.now(),
      metadata,
    });
  } catch (error) {
    // Log activity failures shouldn't break the main operation
    console.error("Failed to log booking activity:", error);
  }
}

/**
 * Validate booking data using Convex validators
 */
export const bookingDataValidator = v.object({
  customerName: v.string(),
  customerEmail: v.string(),
  customerPhone: v.string(),
  serviceId: v.string(),
  preferredDate: v.string(),
  preferredTime: v.string(),
  vehicleType: v.union(
    v.literal("sedan"),
    v.literal("suv"),
    v.literal("truck"),
    v.literal("van"),
    v.literal("coupe"),
    v.literal("sports")
  ),
  message: v.optional(v.string()),
  status: v.optional(v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("cancelled")
  )),
  notes: v.optional(v.string()),
});

