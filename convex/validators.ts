import { v } from "convex/values";

// TypeScript Interfaces derived from Convex schemas
export interface BookingData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string; // Convex `v.id` resolves to string in TypeScript
  preferredDate: string;
  preferredTime: string;
  vehicleType: "sedan" | "suv" | "truck" | "van" | "coupe" | "sports";
  message?: string;
  status?: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
}

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
  process: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  isActive: boolean;
  sortOrder: number;
}

export interface ReviewData {
  customerName: string;
  rating: number;
  comment: string;
  serviceId: string; // Convex `v.id` resolves to string in TypeScript
  date: string;
}

// Data validation schemas using Convex validation system
// Additional validation logic is implemented in the functions themselves

// Basic schemas using Convex validation
export const bookingSchema = v.object({
  customerName: v.string(),
  customerEmail: v.string(),
  customerPhone: v.string(),
  serviceId: v.id("services"),
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
});

export const customerSchema = v.object({
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
  notes: v.optional(v.string()),
});

export const serviceSchema = v.object({
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
});

export const reviewSchema = v.object({
  customerName: v.string(),
  rating: v.number(),
  comment: v.string(),
  serviceId: v.id("services"),
  date: v.string(),
});

export const adminUserSchema = v.object({
  email: v.string(),
  name: v.string(),
  role: v.union(v.literal("admin"), v.literal("staff")),
  permissions: v.array(v.string()),
});

export const businessSettingsSchema = v.object({
  key: v.string(),
  value: v.string(),
  description: v.optional(v.string()),
});

export const updateBookingSchema = v.object({
  bookingId: v.id("bookings"),
  status: v.optional(v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("cancelled")
  )),
  notes: v.optional(v.string()),
  confirmedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
  cancelledAt: v.optional(v.number()),
});

export const updateServiceSchema = v.object({
  serviceId: v.id("services"),
  name: v.optional(v.string()),
  price: v.optional(v.string()),
  description: v.optional(v.string()),
  features: v.optional(v.array(v.string())),
  benefits: v.optional(v.array(v.string())),
  isActive: v.optional(v.boolean()),
  sortOrder: v.optional(v.number()),
});

export const bookingFiltersSchema = v.object({
  status: v.optional(v.union(
    v.literal("pending"),
    v.literal("confirmed"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("cancelled")
  )),
  dateRange: v.optional(v.object({
    start: v.string(),
    end: v.string(),
  })),
  serviceId: v.optional(v.id("services")),
  customerEmail: v.optional(v.string()),
  limit: v.optional(v.number()),
  cursor: v.optional(v.string()),
});

export const serviceFiltersSchema = v.object({
  category: v.optional(v.union(v.literal("primary"), v.literal("additional"))),
  isActive: v.optional(v.boolean()),
  limit: v.optional(v.number()),
});

export const reviewFiltersSchema = v.object({
  serviceId: v.optional(v.id("services")),
  isApproved: v.optional(v.boolean()),
  minRating: v.optional(v.number()),
  limit: v.optional(v.number()),
});

// Utility validation functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone) && phone.replace(/[\D]/g, '').length >= 10;
}

export function validateDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function validateTime(timeString: string): boolean {
  const timeRegex = /^\d{1,2}:\d{2}\s?(AM|PM)$/i;
  return timeRegex.test(timeString);
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 2000); // Limit length
}

export function validateSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}

export function validatePrice(price: string): boolean {
  const priceRegex = /^\$?\d+(\.\d{2})?\+?$/;
  return priceRegex.test(price) && price.length <= 20;
}

// Booking conflict detection
export function validateBookingConflict(
  existingBookings: BookingData[],
  newDate: string,
  newTime: string
): boolean {
  const hasConflict = existingBookings.some(booking => 
    booking.preferredDate === newDate && 
    booking.preferredTime === newTime && 
    booking.status === 'confirmed'
  );
  return !hasConflict;
}

// Enhanced validation functions with detailed error messages
export function validateBookingData(data: BookingData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!data.customerName || data.customerName.length > 100) {
    errors.push("Name cannot exceed 100 characters");
  }

  if (!validateEmail(data.customerEmail)) {
    errors.push("Invalid email address");
  }

  if (!validatePhone(data.customerPhone)) {
    errors.push("Invalid phone number format");
  }

  if (!validateDate(data.preferredDate)) {
    errors.push("Invalid date format (YYYY-MM-DD)");
  }

  if (!validateTime(data.preferredTime)) {
    errors.push("Invalid time format (e.g., 2:30 PM)");
  }

  if (data.message && data.message.length > 1000) {
    errors.push("Message cannot exceed 1000 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateServiceData(data: ServiceData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Service name must be at least 2 characters");
  }
  if (!data.slug || !validateSlug(data.slug)) {
    errors.push("Invalid slug format");
  }
  if (!validatePrice(data.price)) {
    errors.push("Invalid price format");
  }
  if (!data.description || data.description.length < 20) {
    errors.push("Description must be at least 20 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateReviewData(data: ReviewData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.customerName || data.customerName.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }
  if (!data.comment || data.comment.length < 10) {
    errors.push("Review comment must be at least 10 characters");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Custom error types
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Access denied") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class RateLimitError extends Error {
  constructor(message: string = "Too many requests") {
    super(message);
    this.name = "RateLimitError";
  }
}
