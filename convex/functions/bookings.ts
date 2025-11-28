import { query, mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { 
  bookingSchema,
  bookingFiltersSchema,
  validateBookingData,
  sanitizeInput 
} from "../validators";
import { 
  getCurrentUser, 
  logActivity,
  handleConvexError,
  sanitizeAndValidateBooking,
  checkBookingConflicts,
  rateLimit
} from "../auth";

// Create new booking (Guest access with rate limiting)
export const createBooking = mutation(async (ctx, bookingData: any) => {
  try {
    // Apply rate limiting for guest access
    const clientIp = ctx.headers.get("x-forwarded-for") || ctx.headers.get("x-real-ip") || "unknown";
    const rateLimitKey = `guest_booking_${clientIp}`;
    
    if (!rateLimit(rateLimitKey, 5, 60 * 60 * 1000)) { // 5 bookings per hour per IP
      throw new ConvexError("Too many booking attempts. Please try again later.");
    }

    // Sanitize and validate booking data
    const sanitizedData = sanitizeAndValidateBooking(bookingData);

    // Verify service exists and is active
    const service = await ctx.db.get(sanitizedData.serviceId as any);
    if (!service || !service.isActive) {
      throw new ConvexError("Selected service is not available");
    }

    // Check for booking conflicts
    await checkBookingConflicts(ctx, sanitizedData.preferredDate, sanitizedData.preferredTime);

    // Create the booking
    // Create the booking
    if (!sanitizedData.serviceId) {
      throw new ConvexError("Service ID is required for booking");
    }
    const bookingId = await ctx.db.insert("bookings", {
      ...sanitizedData,
      serviceId: sanitizedData.serviceId as string, // or as Id<"services"> if available
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await logActivity(ctx, "booking_created", {
      customerEmail: sanitizedData.customerEmail,
      bookingId: bookingId,
      changes: `New booking created for ${sanitizedData.customerName}`,
    });

    return bookingId;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get all bookings with filtering (Admin only)
export const getBookings = query(async (ctx, filters: any = {}) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can view all bookings");
    }

    let query = ctx.db.query("bookings");

    // Apply filters
    if (filters.status) {
      query = query.filter((q: any) => q.eq(q.field("status"), filters.status));
    }
    
    if (filters.date) {
      query = query.filter((q: any) => q.eq(q.field("preferredDate"), filters.date));
    }
    
    if (filters.serviceId) {
      query = query.filter((q: any) => q.eq(q.field("serviceId"), filters.serviceId));
    }
    
    if (filters.customerEmail) {
      query = query.filter((q: any) => q.eq(q.field("customerEmail"), filters.customerEmail));
    }
    
    if (filters.dateRange) {
      query = query.filter((q: any) => 
        q.and(
          q.gte(q.field("preferredDate"), filters.dateRange.start),
          q.lte(q.field("preferredDate"), filters.dateRange.end)
        )
      );
    }

    // Order by creation date (most recent first)
    const bookings = await query
      .order("desc")
      .take(filters.limit || 50);

    return bookings;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get bookings by date (for calendar view)
export const getBookingsByDate = query(async (ctx, { date }: { date: string }) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new ConvexError("Authentication required");
    }

    const bookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("preferredDate"), date))
      .order("asc")
      .collect();

    return bookings;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get bookings by status (for admin dashboard)
export const getBookingsByStatus = query(async (ctx, { 
  status 
}: { 
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" 
}) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can view bookings by status");
    }

    const bookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("status"), status))
      .order("desc")
      .take(20);

    return bookings;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get single booking by ID
export const getBooking = query(async (ctx, { bookingId }: { bookingId: string }) => {
  try {
    const user = await getCurrentUser(ctx);
    const booking = await ctx.db.get(bookingId as any);
    
    if (!booking) {
      throw new ConvexError("Booking not found");
    }

    // Allow access if:
    // 1. Admin user
    // 2. Customer viewing their own booking (by email)
    if (!user || user.role !== "admin") {
      if (!user || user.email !== booking.customerEmail) {
        throw new ConvexError("Access denied");
      }
    }

    return booking;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Update booking status (Admin only)
export const updateBookingStatus = mutation(async (ctx, { 
  bookingId, 
  status, 
  notes 
}: { 
  bookingId: string; 
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes?: string;
}) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can update booking status");
    }

    // Get existing booking
    const existingBooking = await ctx.db.get(bookingId as any);
    if (!existingBooking) {
      throw new ConvexError("Booking not found");
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: Date.now(),
    };

    if (notes !== undefined) {
      updateData.notes = sanitizeInput(notes);
    }

    // Set timestamp based on status
    if (status === "confirmed" && !existingBooking.confirmedAt) {
      updateData.confirmedAt = Date.now();
    } else if (status === "completed" && !existingBooking.completedAt) {
      updateData.completedAt = Date.now();
    } else if (status === "cancelled" && !existingBooking.cancelledAt) {
      updateData.cancelledAt = Date.now();
    }

    // If confirming a booking, check for conflicts
    if (status === "confirmed" && existingBooking.status !== "confirmed") {
      await checkBookingConflicts(
        ctx, 
        existingBooking.preferredDate, 
        existingBooking.preferredTime, 
        bookingId
      );
    }

    // Update the booking
    await ctx.db.patch(bookingId as any, updateData);

    await logActivity(ctx, "booking_status_updated", {
      userId: user.userId,
      bookingId: bookingId,
      changes: `Status changed from ${existingBooking.status} to ${status}`,
    });

    return bookingId;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Cancel booking (Admin or customer)
export const cancelBooking = mutation(async (ctx, { 
  bookingId, 
  reason 
}: { 
  bookingId: string; 
  reason?: string;
}) => {
  try {
    const user = await getCurrentUser(ctx);
    
    // Get existing booking
    const existingBooking = await ctx.db.get(bookingId as any);
    if (!existingBooking) {
      throw new ConvexError("Booking not found");
    }

    // Check authorization
    const canCancel = user && (
      user.role === "admin" || 
      user.email === existingBooking.customerEmail
    );

    if (!canCancel) {
      throw new ConvexError("Not authorized to cancel this booking");
    }

    // Check if booking can be cancelled
    if (["completed", "cancelled"].includes(existingBooking.status)) {
      throw new ConvexError("This booking cannot be cancelled");
    }

    // Update booking status
    await ctx.db.patch(bookingId as any, {
      status: "cancelled",
      cancelledAt: Date.now(),
      notes: reason ? sanitizeInput(reason) : existingBooking.notes,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, "booking_cancelled", {
      userId: user?.userId,
      bookingId: bookingId,
      customerEmail: existingBooking.customerEmail,
      changes: `Booking cancelled. Reason: ${reason || "No reason provided"}`,
    });

    return bookingId;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Update booking notes (Admin only)
export const updateBookingNotes = mutation(async (ctx, { 
  bookingId, 
  notes 
}: { 
  bookingId: string; 
  notes?: string;
}) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can update booking notes");
    }

    // Get existing booking
    const existingBooking = await ctx.db.get(bookingId as any);
    if (!existingBooking) {
      throw new ConvexError("Booking not found");
    }

    // Update notes
    await ctx.db.patch(bookingId as any, {
      notes: notes ? sanitizeInput(notes) : undefined,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, "booking_notes_updated", {
      userId: user.userId,
      bookingId: bookingId,
      changes: "Booking notes updated",
    });

    return bookingId;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get booking statistics (Admin only)
export const getBookingStats = query(async (ctx) => {
  try {
    // Check authentication and permissions
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can view booking statistics");
    }

    const allBookings = await ctx.db.query("bookings").collect();
    const now = Date.now();
    const today = new Date().toISOString().split('T')[0];

    // Calculate statistics
    const stats = {
      total: allBookings.length,
      pending: allBookings.filter(b => b.status === "pending").length,
      confirmed: allBookings.filter(b => b.status === "confirmed").length,
      inProgress: allBookings.filter(b => b.status === "in_progress").length,
      completed: allBookings.filter(b => b.status === "completed").length,
      cancelled: allBookings.filter(b => b.status === "cancelled").length,
      today: allBookings.filter(b => b.preferredDate === today).length,
      thisWeek: allBookings.filter(b => {
        const bookingDate = new Date(b.preferredDate);
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return bookingDate >= weekAgo;
      }).length,
      thisMonth: allBookings.filter(b => {
        const bookingDate = new Date(b.preferredDate);
        const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
        return bookingDate >= monthAgo;
      }).length,
    };

    // Get recent activity
    const recentBookings = allBookings
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);

    return {
      stats,
      recentBookings,
    };
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get available time slots for a date (for booking form)
export const getAvailableTimeSlots = query(async (ctx, { 
  date, 
  serviceId 
}: { 
  date: string; 
  serviceId: string;
}) => {
  try {
    // Define business hours and time slots
    const businessHours = {
      start: 7, // 7 AM
      end: 22,  // 10 PM
    };

    const timeSlots = [];
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 60) { // 1-hour slots
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? "PM" : "AM";
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        timeSlots.push(timeString);
      }
    }

    // Get existing bookings for the date
    const existingBookings = await ctx.db
      .query("bookings")
      .filter((q: any) => 
        q.and(
          q.eq(q.field("preferredDate"), date),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    // Remove booked time slots
    const bookedTimes = new Set(existingBookings.map(b => b.preferredTime));
    const availableSlots = timeSlots.filter(time => !bookedTimes.has(time));

    return {
      date,
      serviceId,
      availableSlots,
      totalSlots: timeSlots.length,
      bookedSlots: bookedTimes.size,
    };
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Get customer booking history by email
export const getCustomerBookingHistory = query(async (ctx, { 
  email 
}: { 
  email: string;
}) => {
  try {
    const user = await getCurrentUser(ctx);
    
    // Allow access if:
    // 1. Admin user
    // 2. Customer viewing their own history
    if (!user || user.role !== "admin") {
      if (!user || user.email !== email) {
        throw new ConvexError("Access denied");
      }
    }

    const bookings = await ctx.db
      .query("bookings")
      .filter((q: any) => q.eq(q.field("customerEmail"), email))
      .order("desc")
      .collect();

    return bookings;
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});
