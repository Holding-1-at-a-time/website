import { MutationCtx, QueryCtx } from "./_generated/server";
import { v, Infer } from "convex/values";

/**
 * Centralized type definitions for the Convex backend
 * This provides a single source of truth for all data types
 *
 * Note: Convex IDs are represented as strings in interfaces but actual
 * database operations use generated Id<"table"> types from schema.ts
 */

// ===== SERVICE TYPES =====
export interface ServiceData {
  _id: string;
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
  createdAt: number;
  updatedAt: number;
}

export type PartialServiceData = Partial<Omit<ServiceData, "_id" | "createdAt" | "updatedAt">>;
export type ServiceCreateData = Omit<ServiceData, "_id" | "createdAt" | "updatedAt">;
export type ServiceUpdateData = Partial<ServiceCreateData> & { updatedAt?: number };

// ===== BOOKING TYPES =====
export interface BookingData {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  preferredDate: string; // ISO date string (YYYY-MM-DD)
  preferredTime: string; // Time format (HH:MM AM/PM)
  vehicleType: "sedan" | "suv" | "truck" | "van" | "coupe" | "sports";
  message?: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  notes?: string;
  createdAt: number;
  updatedAt: number;
  // Optional timestamp fields for status tracking
  confirmedAt?: number;
  completedAt?: number;
  cancelledAt?: number;
}

export interface BookingFilters {
  customerEmail?: string;
  status?: BookingData["status"];
  serviceId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  limit?: number;
  cursor?: string;
}

export interface BookingUpdateData {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceId?: string;
  preferredDate?: string;
  preferredTime?: string;
  vehicleType?: BookingData["vehicleType"];
  message?: string;
  status?: BookingData["status"];
  notes?: string;
  confirmedAt?: number;
  completedAt?: number;
  cancelledAt?: number;
  updatedAt?: number;
}

export interface BookingCreateData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  vehicleType: BookingData["vehicleType"];
  message?: string;
  status?: BookingData["status"];
  notes?: string;
}

// ===== REVIEW TYPES =====
export interface ReviewData {
  _id: string;
  customerName: string;
  rating: number; // 1-5 stars
  comment: string;
  serviceId: string;
  isApproved: boolean;
  isFeatured: boolean;
  date: string; // ISO date string
  createdAt: number;
  updatedAt: number;
}

export interface ReviewFilters {
  serviceId?: string;
  isApproved?: boolean;
  minRating?: number;
  maxRating?: number;
  limit?: number;
  cursor?: string;
}

export interface ReviewUpdateData {
  comment?: string;
  rating?: number;
  isApproved?: boolean;
  isFeatured?: boolean;
  updatedAt?: number;
}

export interface ReviewCreateData {
  customerName: string;
  rating: number;
  comment: string;
  serviceId: string;
  date?: string;
}

// ===== CONTEXT TYPES =====
export type ContextType = QueryCtx | MutationCtx;
export type ConvexId<T extends string> = string; // Abstract representation for documentation

export interface UserContext {
  _id: string;
  userId: string;
  email: string;
  name: string;
  role: "admin" | "staff";
  permissions: string[];
  isActive: boolean;
}

// ===== ERROR TYPES =====
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

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// ===== RATE LIMITING TYPES =====
export interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// ===== STATISTICS TYPES =====
export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  revenue?: number;
}

export interface BookingStats {
  total: number;
  today: number;
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

export interface ReviewStats {
  total: number;
  approved: number;
  featured: number;
  pending: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}