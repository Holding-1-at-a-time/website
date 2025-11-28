import { internalQuery, internalMutation, query, mutation } from "../_generated/server";
import { v } from "convex/values";
import {
  getBookingById,
  getBookingsWithFilters,
  getBookingsByService,
  getBookingsByDateRange,
  getTodaysBookings,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingStats,
  getAvailableTimeSlots,
  checkAdminAccess,
  bookingDataValidator,
  type BookingData
} from "../model/bookings";

/**
 * PUBLIC API FUNCTIONS (Following Convex Best Practices)
 * These functions have proper validation and appropriate access control
 */

// Create a new booking (public access - guest booking system)
export const createBookingPublic = mutation({
  args: bookingDataValidator,
  handler: async (ctx, bookingData) => {
    // Add rate limiting check (basic implementation)
    const recentBookings = await ctx.db
      .query("bookings")
      .filter((q) => 
        q.eq(q.field("customerEmail"), bookingData.customerEmail)
      )
      .order("desc")
      .take(1);
    
    if (recentBookings.length > 0) {
      const lastBooking = recentBookings[0];
      const timeDiff = Date.now() - lastBooking._creationTime;
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
      
      if (timeDiff < oneHour) {
        throw new Error("You can only create one booking per hour. Please try again later.");
      }
    }
    
    const bookingId = await createBooking(ctx, bookingData as BookingData);
    return { bookingId, message: "Booking created successfully!" };
  },
});

// Get customer's own bookings (customer access)
export const getCustomerBookings = query({
  args: {
    customerEmail: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { customerEmail, limit }) => {
    return await getBookingsWithFilters(ctx, { 
      customerEmail, 
      limit: limit || 20 
    });
  },
});

// Get available time slots for a date and service (public access)
export const getAvailableTimeSlotsPublic = query({
  args: {
    date: v.string(),
    serviceId: v.string(),
  },
  handler: async (ctx, { date, serviceId }) => {
    return await getAvailableTimeSlots(ctx, date, serviceId);
  },
});

// Get booking by ID (customer can access their own, admin can access all)
export const getBookingByIdPublic = query({
  args: {
    bookingId: v.string(),
    customerEmail: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, customerEmail }) => {
    const booking = await getBookingById(ctx, bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    // Allow access if customerEmail matches or user is admin
    if (customerEmail && booking.customerEmail === customerEmail) {
      return booking;
    }
    
    // Check if user is admin
    try {
      await checkAdminAccess(ctx);
      return booking;
    } catch {
      throw new Error("Unauthorized access to booking");
    }
  },
});

/**
 * ADMIN API FUNCTIONS (Restricted Access)
 * These functions require admin authentication
 */

// Get all bookings for admin view
export const getAllBookingsAdmin = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit }) => {
    await checkAdminAccess(ctx);
    return await getBookingsWithFilters(ctx, { 
      status, 
      limit: limit || 100 
    });
  },
});

// Get bookings by service (admin only)
export const getBookingsByServiceAdmin = query({
  args: {
    serviceId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { serviceId, limit }) => {
    await checkAdminAccess(ctx);
    return await getBookingsByService(ctx, serviceId, limit || 100);
  },
});

// Get bookings by date range (admin only)
export const getBookingsByDateRangeAdmin = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { startDate, endDate, limit }) => {
    await checkAdminAccess(ctx);
    return await getBookingsByDateRange(ctx, startDate, endDate, limit || 1000);
  },
});

// Get today's bookings (admin only)
export const getTodaysBookingsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await checkAdminAccess(ctx);
    return await getTodaysBookings(ctx);
  },
});

// Update booking (admin only)
export const updateBookingAdmin = mutation({
  args: {
    bookingId: v.string(),
    updates: bookingDataValidator,
  },
  handler: async (ctx, { bookingId, updates }) => {
    await checkAdminAccess(ctx);
    await updateBooking(ctx, bookingId, updates as Partial<BookingData>);
    return { success: true, message: "Booking updated successfully" };
  },
});

// Cancel booking (admin only)
export const cancelBookingAdmin = mutation({
  args: {
    bookingId: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, reason }) => {
    await checkAdminAccess(ctx);
    await cancelBooking(ctx, bookingId, reason);
    return { success: true, message: "Booking cancelled successfully" };
  },
});

// Get booking statistics (admin only)
export const getBookingStatsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await checkAdminAccess(ctx);
    return await getBookingStats(ctx);
  },
});

// Confirm booking (admin only) - quick status update
export const confirmBookingAdmin = mutation({
  args: {
    bookingId: v.string(),
  },
  handler: async (ctx, { bookingId }) => {
    await checkAdminAccess(ctx);
    await updateBooking(ctx, bookingId, { 
      status: "confirmed" 
    } as Partial<BookingData>);
    return { success: true, message: "Booking confirmed successfully" };
  },
});

// Mark booking as in progress (admin only)
export const startBookingAdmin = mutation({
  args: {
    bookingId: v.string(),
  },
  handler: async (ctx, { bookingId }) => {
    await checkAdminAccess(ctx);
    await updateBooking(ctx, bookingId, { 
      status: "in_progress" 
    } as Partial<BookingData>);
    return { success: true, message: "Booking marked as in progress" };
  },
});

// Complete booking (admin only)
export const completeBookingAdmin = mutation({
  args: {
    bookingId: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, notes }) => {
    await checkAdminAccess(ctx);
    await updateBooking(ctx, bookingId, { 
      status: "completed",
      notes: notes || ""
    } as Partial<BookingData>);
    return { success: true, message: "Booking marked as completed" };
  },
});

// Add notes to booking (admin only)
export const addBookingNotesAdmin = mutation({
  args: {
    bookingId: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, { bookingId, notes }) => {
    await checkAdminAccess(ctx);
    await updateBooking(ctx, bookingId, { notes } as Partial<BookingData>);
    return { success: true, message: "Notes added successfully" };
  },
});

/**
 * CUSTOMER API FUNCTIONS (Limited Access)
 * These allow customers to manage their own bookings
 */

// Customer can update their own booking (limited fields)
export const updateCustomerBooking = mutation({
  args: {
    bookingId: v.string(),
    customerEmail: v.string(),
    updates: v.object({
      preferredDate: v.optional(v.string()),
      preferredTime: v.optional(v.string()),
      message: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { bookingId, customerEmail, updates }) => {
    // Verify the booking belongs to this customer
    const booking = await getBookingById(ctx, bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    if (booking.customerEmail !== customerEmail) {
      throw new Error("Unauthorized: You can only modify your own bookings");
    }
    
    // Only allow certain fields to be updated by customers
    const allowedUpdates: Partial<BookingData> = {};
    if (updates.preferredDate !== undefined) allowedUpdates.preferredDate = updates.preferredDate;
    if (updates.preferredTime !== undefined) allowedUpdates.preferredTime = updates.preferredTime;
    if (updates.message !== undefined) allowedUpdates.message = updates.message;
    
    await updateBooking(ctx, bookingId, allowedUpdates);
    return { success: true, message: "Booking updated successfully" };
  },
});

// Customer can cancel their own booking
export const cancelCustomerBooking = mutation({
  args: {
    bookingId: v.string(),
    customerEmail: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { bookingId, customerEmail, reason }) => {
    // Verify the booking belongs to this customer
    const booking = await getBookingById(ctx, bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    if (booking.customerEmail !== customerEmail) {
      throw new Error("Unauthorized: You can only cancel your own bookings");
    }
    
    if (booking.status === "cancelled") {
      throw new Error("Booking is already cancelled");
    }
    
    await cancelBooking(ctx, bookingId, reason);
    return { success: true, message: "Booking cancelled successfully" };
  },
});
