import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";
import {
  sanitizeInput,
  validateEmail,
  validatePhone
} from "./validators";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Permission constants
export const PERMISSIONS = {
  // Booking permissions
  BOOKINGS_READ: "bookings:read",
  BOOKINGS_WRITE: "bookings:write",
  BOOKINGS_DELETE: "bookings:delete",
  
  // Customer permissions
  CUSTOMERS_READ: "customers:read",
  CUSTOMERS_WRITE: "customers:write",
  
  // Service permissions
  SERVICES_READ: "services:read",
  SERVICES_WRITE: "services:write",
  
  // Review permissions
  REVIEWS_READ: "reviews:read",
  REVIEWS_WRITE: "reviews:write",
  REVIEWS_MODERATE: "reviews:moderate",
  
  // Admin permissions
  ADMIN_MANAGE: "admin:manage",
  SETTINGS_MANAGE: "settings:manage",
} as const;

export const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS),
  staff: [
    PERMISSIONS.BOOKINGS_READ,
    PERMISSIONS.BOOKINGS_WRITE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_WRITE,
    PERMISSIONS.SERVICES_READ,
    PERMISSIONS.REVIEWS_READ,
  ],
};

// Get current authenticated user
export async function getCurrentUser(ctx: QueryCtx | MutationCtx) {
  // For now, we'll implement a simple user check
  // In production, this would integrate with Convex auth
  const user = await ctx.auth.getUserIdentity();
  if (!user) return null;
  
  return {
    _id: user._id,
    userId: user.userId,
    email: user.email,
    name: user.name,
    role: user.role as "admin" | "staff",
    permissions: user.permissions || [],
    isActive: user.isActive ?? true,
  };
}

// Rate limiting function
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Input sanitization and validation
export function sanitizeAndValidateBooking(data: {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceId?: string;
  preferredDate?: string;
  preferredTime?: string;
  vehicleType?: string;
  message?: string;
}) {
  // Sanitize inputs
  const sanitized = {
    customerName: sanitizeInput(data.customerName || ""),
    customerEmail: sanitizeInput(data.customerEmail || ""),
    customerPhone: sanitizeInput(data.customerPhone || ""),
    serviceId: data.serviceId,
    preferredDate: sanitizeInput(data.preferredDate || ""),
    preferredTime: sanitizeInput(data.preferredTime || ""),
    vehicleType: data.vehicleType,
    message: data.message ? sanitizeInput(data.message) : undefined,
  };

  // Validate inputs
  if (!sanitized.customerName || sanitized.customerName.length < 2) {
    throw new ConvexError("Name must be at least 2 characters");
  }
  if (!validateEmail(sanitized.customerEmail)) {
    throw new ConvexError("Invalid email address");
  }
  if (!validatePhone(sanitized.customerPhone)) {
    throw new ConvexError("Invalid phone number format");
  }
  if (!sanitized.preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(sanitized.preferredDate)) {
    throw new ConvexError("Invalid date format (YYYY-MM-DD)");
  }
  if (!sanitized.preferredTime || !/^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(sanitized.preferredTime)) {
    throw new ConvexError("Invalid time format");
  }

  return sanitized;
}

// Session management (simplified) - Using MutationCtx for both operations
export async function createSession(ctx: MutationCtx, userId: string) {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await ctx.db.insert("sessions", {
    sessionId,
    userId,
    expiresAt,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    metadata: {
      userAgent: "", // Headers not available in mutations
      ipAddress: "",
    },
  });

  return sessionId;
}

export async function validateSession(ctx: QueryCtx | MutationCtx, sessionId: string) {
  const session = await ctx.db
    .query("sessions")
    .filter((q) => q.eq(q.field("sessionId"), sessionId))
    .unique();

  if (!session || session.expiresAt < Date.now()) {
    // Return null instead of throwing to allow graceful handling
    return null;
  }

  // Update last accessed time (only in MutationCtx)
  if ("db" in ctx && "insert" in ctx.db) {
    await ctx.db.patch(session._id, {
      lastAccessed: Date.now(),
    });
  }

  return session;
}

// Activity logging
export async function logActivity(
  ctx: MutationCtx,
  action: string,
  metadata: {
    userId?: string;
    bookingId?: any; // Using any temporarily to avoid schema conflicts
    customerEmail?: string;
    changes?: string;
  } = {}
) {
  try {
    await ctx.db.insert("activityLog", {
      action,
      userId: metadata.userId,
      bookingId: metadata.bookingId,
      customerEmail: metadata.customerEmail,
      timestamp: Date.now(),
      metadata: {
        userAgent: "", // Headers not available in mutations
        ipAddress: "",
        changes: metadata.changes,
      },
    });
  } catch (error) {
    // Log activity failures shouldn't break the main operation
    console.error("Failed to log activity:", error);
  }
}

// Booking conflict detection
export async function checkBookingConflicts(
  ctx: QueryCtx,
  date: string,
  time: string,
  excludeBookingId?: string
) {
  let query = ctx.db
    .query("bookings")
    .filter((q) => 
      q.and(
        q.eq(q.field("preferredDate"), date),
        q.eq(q.field("preferredTime"), time),
        q.eq(q.field("status"), "confirmed")
      )
    );

  if (excludeBookingId) {
    query = query.filter((q) => q.neq(q.field("_id"), excludeBookingId));
  }

  const conflictingBookings = await query.collect();
  
  if (conflictingBookings.length > 0) {
    throw new ConvexError("This time slot is already booked");
  }
}

// Security headers configuration
export function getSecurityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' wss: https:",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  };
}

// Error message formatting
export function formatErrorMessage(error: unknown): string {
  if (error instanceof ConvexError) {
    return error.message;
  }
  
  if (error instanceof Error && error.message) {
    return error.message;
  }
  
  return "An unexpected error occurred";
}