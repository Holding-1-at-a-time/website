# Convex Database Integration Technical Implementation Plan
## One Detail At A Time Auto Detailing Business Website

**Project**: Next.js Auto Detailing Website with Convex Backend Integration  
**Date**: November 27, 2025  
**Version**: 1.0  
**Scope**: Core functionality with booking system, customer management, and admin dashboard

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Database Schema Design](#2-database-schema-design)
3. [Frontend Integration Strategy](#3-frontend-integration-strategy)
4. [Implementation Timeline](#4-implementation-timeline)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Real-time Functionality Implementation](#6-real-time-functionality-implementation)
7. [Testing Strategy](#7-testing-strategy)
8. [Deployment Configuration](#8-deployment-configuration)
9. [Performance Optimization](#9-performance-optimization)
10. [Security Considerations](#10-security-considerations)

---

## 1. Architecture Overview

### System Architecture

The application follows a modern JAMstack architecture with Convex as the backend service:

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   Next.js Client    │    │   Convex Backend    │    │   External Services │
│                     │    │                     │    │                     │
│ • React Components  │◄──►│ • Database Schemas  │    │ • Email Service     │
│ • Real-time Subscr. │    │ • Query Functions   │    │ • Google Calendar   │
│ • State Management  │    │ • Mutation Functions│    │ • Payment Gateway   │
│ • Authentication UI │    │ • Real-time Updates │    │ • SMS Notifications │
│ • Admin Dashboard   │    │ • Auth Management   │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### Convex Backend Services

**Real-time Data Synchronization**:
- Automatic query result updates across all connected clients
- Optimistic UI updates with conflict resolution
- Live booking availability updates
- Real-time admin dashboard updates

**User Authentication**:
- Built-in Convex authentication with multiple providers
- Session management with automatic token refresh
- Role-based access control (RBAC)
- Secure admin authentication

**API Endpoints**:
- REST-like query and mutation functions
- Real-time subscriptions for live data
- Type-safe function signatures
- Automatic request validation

### Data Flow Architecture

```
Client Request → Convex Client → Query/Mutation → Database → Real-time Update → All Clients
       ↓
  Optimistic UI Update
       ↓
  Server Response
       ↓
  UI Reconciliation
```

---

## 2. Database Schema Design

### Core Collections Schema

#### Services Collection
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
   .index("by_active", ["isActive"])
   .index("by_slug", ["slug"])),

  bookings: defineTable({
    // Customer Information (Guest bookings)
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    
    // Booking Details
    serviceId: v.id("services"),
    preferredDate: v.string(), // ISO date string
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
    
    // Booking Status
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    confirmedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
   .index("by_date", ["preferredDate"])
   .index("by_created", ["createdAt"])
   .index("by_customer_email", ["customerEmail"])
   .index("by_service_date", ["serviceId", "preferredDate"])),

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
   .index("by_created", ["createdAt"])),

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
   .index("by_created", ["createdAt"])),

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
   .index("by_role", ["role"])),

  businessSettings: defineTable({
    key: v.string(),
    value: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.id("adminUsers"),
  }).index("by_key", ["key"])),
});
```

### Relationship Design

**One-to-Many Relationships**:
- Service → Bookings (1 service can have many bookings)
- Service → Reviews (1 service can have many reviews)
- Customer → Bookings (1 customer can have many bookings)

**Many-to-Many Relationships**:
- AdminUsers → BusinessSettings (through updatedBy reference)

### Data Validation Rules

```typescript
// Additional validation patterns
const customerEmail = v.string().email();
const phoneNumber = v.string().regex(/^[\+]?[1-9][\d]{0,15}$/);
const dateString = v.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeString = v.string().regex(/^\d{1,2}:\d{2}\s?(AM|PM)$/);
const rating = v.number().min(1).max(5);
```

---

## 3. Frontend Integration Strategy

### Convex Client Setup

**Enhanced ConvexClientProvider**:
```typescript
// app/ConvexClientProvider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!, {
  // Enable real-time subscriptions
  realtime: true,
  // Enable optimistic updates
  optimisticUpdates: true,
  // Enable automatic reconnection
  reconnection: "exponential",
});

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

### React Hook Implementation

**Custom Hooks for Data Management**:
```typescript
// hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

export function useBookings(filters?: {
  status?: string;
  dateRange?: { start: string; end: string };
  serviceId?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  
  const bookings = useQuery(api.bookings.getBookings, filters || {});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (bookings !== undefined) {
      setIsLoading(false);
    }
  }, [bookings]);

  return {
    bookings: bookings || [],
    isLoading,
    refetch: queryClient.invalidateQueries,
  };
}

export function useBookingMutations() {
  const createBooking = useMutation(api.bookings.createBooking);
  const updateBooking = useMutation(api.bookings.updateBooking);
  const cancelBooking = useMutation(api.bookings.cancelBooking);
  
  return { createBooking, updateBooking, cancelBooking };
}
```

**Real-time Subscription Hook**:
```typescript
// hooks/useRealTimeBookings.ts
import { useEffect } from "react";
import { useQuery, useQueryClient } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useRealTimeBookings(date: string) {
  const queryClient = useQueryClient();
  
  // Get initial data
  const bookings = useQuery(api.bookings.getBookingsByDate, { date });
  
  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = api.bookings.subscribeBookingsByDate
      .watch({}, { date })
      .onUpdate(() => {
        // Automatically refresh data on updates
        queryClient.invalidateQueries();
      });

    return () => unsubscribe();
  }, [date, queryClient]);

  return bookings || [];
}
```

### Service Integration

**Dynamic Service Data Loading**:
```typescript
// components/ServiceCard.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export function ServiceCard({ category = "primary" }: { category?: "primary" | "additional" }) {
  const services = useQuery(api.services.getServices, { category });
  const { createBooking } = useBookingMutations();

  if (!services) return <div>Loading services...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>Starting at {service.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-4">
              {service.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => createBooking({ serviceId: service._id })}
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## 4. Implementation Timeline

### Phase 1: Database Setup & Schema (Week 1)
**Days 1-2: Schema Design**
- Create comprehensive Convex schema
- Define data validation rules
- Set up indexing strategy
- Test schema with sample data

**Days 3-4: Initial Data Migration**
- Export current static service data
- Import into Convex database
- Verify data integrity
- Set up initial admin user

**Days 5-7: Basic Functions**
- Implement CRUD operations for services
- Create basic query functions
- Add data validation
- Set up security policies

### Phase 2: Core Backend Development (Week 2)
**Days 8-10: Booking System**
- Implement booking creation functions
- Add booking status management
- Create booking validation logic
- Set up conflict detection

**Days 11-12: Customer Management**
- Build customer CRUD operations
- Implement duplicate detection
- Add customer history tracking
- Create customer search functionality

**Days 13-14: Real-time Features**
- Set up Convex subscriptions
- Implement real-time updates
- Add optimistic UI updates
- Test concurrent booking scenarios

### Phase 3: Authentication & Security (Week 3)
**Days 15-17: Admin Authentication**
- Set up Convex authentication
- Create admin login system
- Implement role-based access control
- Add session management

**Days 18-19: Security Policies**
- Define Row Level Security (RLS) policies
- Add API rate limiting
- Implement input sanitization
- Set up security headers

**Days 20-21: Testing & Validation**
- Test authentication flows
- Verify security policies
- Add error handling
- Performance testing

### Phase 4: Frontend Integration (Week 4)
**Days 22-24: Form Integration**
- Update booking form to use Convex
- Add real-time validation
- Implement optimistic updates
- Add loading states

**Days 25-26: Service Data Integration**
- Convert static services to dynamic queries
- Update all service-related components
- Add service management features
- Test data consistency

**Days 27-28: Admin Dashboard**
- Build booking management interface
- Create customer database view
- Add service management panel
- Implement admin navigation

### Phase 5: Real-time & Polish (Week 5)
**Days 29-31: Real-time Features**
- Implement live booking updates
- Add real-time notifications
- Create dashboard auto-refresh
- Test real-time performance

**Days 32-33: UI/UX Improvements**
- Add loading spinners and skeletons
- Implement error boundaries
- Add success/error toasts
- Polish responsive design

**Days 34-35: Final Testing**
- End-to-end testing
- Performance optimization
- Cross-browser testing
- Mobile responsiveness testing

### Phase 6: Deployment & Production (Week 6)
**Days 36-38: Production Setup**
- Configure production environment
- Set up monitoring and logging
- Configure backup strategies
- Create deployment scripts

**Days 39-40: Launch Preparation**
- Final security audit
- Performance monitoring setup
- User acceptance testing
- Documentation completion

**Days 41-42: Go Live**
- Production deployment
- Monitor initial performance
- Address any immediate issues
- Post-launch optimization

---

## 5. Authentication & Authorization

### Convex Authentication Setup

**Authentication Configuration**:
```typescript
// convex/auth.ts
import { convexAuth } from "@convex-dev/auth";
import { Google } from "@convex-dev/auth/providers/Google";
import { Password } from "@convex-dev/auth/providers/Password";
import { Query, Mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut } = convexAuth({
  providers: [
    // Google OAuth for admin users
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Password for staff access
    Password(async (ctx, { email, password }) => {
      const user = await ctx.db
        .query("adminUsers")
        .filter((q) => q.eq(q.field("email"), email))
        .unique();
      
      if (!user) return null;
      
      // Verify password hash (implement proper hashing)
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) return null;
      
      return { userId: user.userId, email: user.email };
    }),
  ],
});

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // Implement bcrypt verification
  return true;
}
```

**Admin User Management**:
```typescript
// convex/functions/admin.ts
import { Query, Mutation } from "../_generated/server";
import { auth } from "../auth";
import { v } from "convex/values";

export const getCurrentUser = Query(async (ctx) => {
  const user = await auth.getUser(ctx);
  if (!user) return null;
  
  const adminUser = await ctx.db
    .query("adminUsers")
    .filter((q) => q.eq(q.field("userId"), user.userId))
    .unique();
    
  return adminUser;
});

export const createAdminUser = Mutation(async (ctx, {
  email,
  name,
  role,
  permissions,
}: {
  email: string;
  name: string;
  role: "admin" | "staff";
  permissions: string[];
}) => {
  const currentUser = await auth.getUser(ctx);
  if (!currentUser) throw new Error("Not authenticated");
  
  // Verify current user is admin
  const adminUser = await ctx.db
    .query("adminUsers")
    .filter((q) => q.eq(q.field("userId"), currentUser.userId))
    .unique();
    
  if (!adminUser || adminUser.role !== "admin") {
    throw new Error("Insufficient permissions");
  }
  
  // Create new admin user
  await ctx.db.insert("adminUsers", {
    userId: `admin_${Date.now()}`, // Generate unique ID
    email,
    name,
    role,
    permissions,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
});
```

### Role-Based Access Control

**Permission System**:
```typescript
// lib/permissions.ts
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
```

**Authorization Middleware**:
```typescript
// convex/middleware/authorize.ts
import { Query, Mutation } from "../_generated/server";
import { auth } from "../auth";
import { ROLE_PERMISSIONS } from "@/lib/permissions";

export function authorize(permission: string) {
  return function<TArgs extends Record<string, any>>(
    fn: (ctx: any, args: TArgs) => Promise<any>
  ) {
    return async (ctx: any, args: TArgs) => {
      const user = await auth.getUser(ctx);
      if (!user) throw new Error("Not authenticated");
      
      const adminUser = await ctx.db
        .query("adminUsers")
        .filter((q) => q.eq(q.field("userId"), user.userId))
        .unique();
        
      if (!adminUser || !adminUser.isActive) {
        throw new Error("Access denied");
      }
      
      const hasPermission = adminUser.permissions.includes(permission) ||
        ROLE_PERMISSIONS[adminUser.role].includes(permission);
        
      if (!hasPermission) {
        throw new Error("Insufficient permissions");
      }
      
      return fn(ctx, args);
    };
  };
}
```

---

## 6. Real-time Functionality Implementation

### Convex Real-time Subscriptions

**Booking Subscription System**:
```typescript
// convex/functions/bookings.ts
import { Query, Mutation } from "../_generated/server";
import { v } from "convex/values";
import { authorize } from "../middleware/authorize";
import { PERMISSIONS } from "@/lib/permissions";

export const getBookings = Query(
  authorize(PERMISSIONS.BOOKINGS_READ),
  async (ctx, { filters = {} }: { filters?: any }) => {
    let query = ctx.db.query("bookings");
    
    if (filters.status) {
      query = query.filter((q) => q.eq(q.field("status"), filters.status));
    }
    
    if (filters.date) {
      query = query.filter((q) => q.eq(q.field("preferredDate"), filters.date));
    }
    
    if (filters.serviceId) {
      query = query.filter((q) => q.eq(q.field("serviceId"), filters.serviceId));
    }
    
    return await query.order("desc").take(100);
  }
);

export const createBooking = Mutation(
  async (ctx, {
    customerName,
    customerEmail,
    customerPhone,
    serviceId,
    preferredDate,
    preferredTime,
    vehicleType,
    message,
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceId: string;
    preferredDate: string;
    preferredTime: string;
    vehicleType: string;
    message?: string;
  }) => {
    // Validate booking conflicts
    const existingBooking = await ctx.db
      .query("bookings")
      .filter((q) => 
        q.and(
          q.eq(q.field("preferredDate"), preferredDate),
          q.eq(q.field("preferredTime"), preferredTime),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .unique();
      
    if (existingBooking) {
      throw new Error("This time slot is already booked");
    }
    
    const bookingId = await ctx.db.insert("bookings", {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      preferredDate,
      preferredTime,
      vehicleType: vehicleType as any,
      message,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return bookingId;
  }
);

// Real-time subscription function
export const subscribeBookings = Query(
  authorize(PERMISSIONS.BOOKINGS_READ),
  async (ctx, { filters = {} }: { filters?: any }) => {
    return ctx.db
      .query("bookings")
      .order("desc")
      .collect();
  }
);
```

**Real-time Update System**:
```typescript
// hooks/useRealTimeUpdates.ts
"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "convex/react";

export function useRealTimeUpdates<T>(
  subscriptionFunction: any,
  filters: any,
  updateCallback: (data: T[]) => void
) {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsConnected(true);
    
    // Subscribe to real-time updates
    const unsubscribe = subscriptionFunction
      .watch({}, filters)
      .onUpdate(() => {
        // Refresh queries when data changes
        queryClient.invalidateQueries();
      });

    return () => {
      setIsConnected(false);
      unsubscribe();
    };
  }, [subscriptionFunction, filters, queryClient]);

  return { isConnected };
}
```

### Optimistic UI Updates

**Booking Form with Optimistic Updates**:
```typescript
// components/BookingForm.tsx
"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBooking = useMutation(api.bookings.createBooking);

  async function onSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    // Optimistic update
    const optimisticBooking = {
      _id: `temp_${Date.now()}`,
      customerName: formData.get("name"),
      status: "pending",
      // ... other fields
    };

    try {
      await createBooking({
        customerName: formData.get("name"),
        customerEmail: formData.get("email"),
        customerPhone: formData.get("phone"),
        serviceId: formData.get("serviceId"),
        preferredDate: formData.get("date"),
        preferredTime: formData.get("time"),
        vehicleType: formData.get("vehicleType"),
        message: formData.get("message"),
      });

      toast.success("Booking submitted!", {
        description: "We'll confirm your appointment within 2 hours.",
      });

      // Reset form
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Booking failed", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Live Notifications

**Real-time Notification System**:
```typescript
// hooks/useNotifications.ts
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function useNotifications() {
  const [hasNewBookings, setHasNewBookings] = useState(false);
  
  // Subscribe to new bookings
  const recentBookings = useQuery(api.bookings.getRecentBookings, { 
    limit: 5 
  });

  useEffect(() => {
    if (recentBookings) {
      const unconfirmedBookings = recentBookings.filter(
        booking => booking.status === "pending"
      );
      
      if (unconfirmedBookings.length > 0) {
        setHasNewBookings(true);
        
        // Show notification
        toast.info("New Booking Request", {
          description: `${unconfirmedBookings.length} new booking(s) need confirmation`,
          duration: 5000,
        });
      }
    }
  }, [recentBookings]);

  return { hasNewBookings, recentBookings };
}
```

---

## 7. Testing Strategy

### Unit Testing for Convex Functions

**Convex Function Testing Setup**:
```typescript
// convex/test/utils.ts
import { setupTests } from "@convex-dev/testing";
import { createContextMap } from "@convex-dev/testing";
import type { DatabaseReader, DatabaseWriter } from "convex/server";

export interface TestContext {
  db: DatabaseReader & DatabaseWriter;
  auth: any;
}

export const testContext: TestContext = setupTests();
```

**Booking Function Tests**:
```typescript
// convex/test/bookings.test.ts
import { test, expect, describe } from "vitest";
import { api } from "../_generated/api";
import { testContext } from "./utils";

describe("Booking Functions", () => {
  test("createBooking creates a new booking", async () => {
    const serviceId = await testContext.db.insert("services", {
      name: "Test Service",
      price: "$100",
      // ... other required fields
    });

    const bookingId = await testContext.mutate(api.bookings.createBooking, {
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "123-456-7890",
      serviceId,
      preferredDate: "2025-12-01",
      preferredTime: "10:00 AM",
      vehicleType: "sedan",
    });

    const booking = await testContext.query(api.bookings.getBooking, {
      bookingId,
    });

    expect(booking?.customerName).toBe("John Doe");
    expect(booking?.status).toBe("pending");
  });

  test("createBooking prevents duplicate bookings", async () => {
    // Create first booking
    const serviceId = await testContext.db.insert("services", {
      name: "Test Service",
      price: "$100",
      // ... other required fields
    });

    await testContext.mutate(api.bookings.createBooking, {
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "123-456-7890",
      serviceId,
      preferredDate: "2025-12-01",
      preferredTime: "10:00 AM",
      vehicleType: "sedan",
    });

    // Try to create duplicate booking
    await expect(testContext.mutate(api.bookings.createBooking, {
      customerName: "Jane Doe",
      customerEmail: "jane@example.com",
      customerPhone: "987-654-3210",
      serviceId,
      preferredDate: "2025-12-01",
      preferredTime: "10:00 AM",
      vehicleType: "suv",
    })).rejects.toThrow("This time slot is already booked");
  });
});
```

### Integration Testing

**Database Operations Test**:
```typescript
// test/integration/database.test.ts
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { api } from "@/convex/_generated/api";
import { testContext } from "../convex/test/utils";

describe("Database Integration Tests", () => {
  let testServiceId: string;

  beforeEach(async () => {
    // Setup test data
    testServiceId = await testContext.db.insert("services", {
      name: "Integration Test Service",
      slug: "integration-test",
      category: "primary",
      title: "Test Service",
      description: "Test description",
      metaDescription: "Test meta",
      features: ["Feature 1", "Feature 2"],
      benefits: ["Benefit 1", "Benefit 2"],
      price: "$100",
      duration: "1 hour",
      process: [],
      isActive: true,
      sortOrder: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });

  afterEach(async () => {
    // Cleanup test data
    await testContext.db.delete(testServiceId);
  });

  test("booking flow integration", async () => {
    // Create booking
    const bookingId = await testContext.mutate(api.bookings.createBooking, {
      customerName: "Integration Test",
      customerEmail: "test@example.com",
      customerPhone: "123-456-7890",
      serviceId: testServiceId,
      preferredDate: "2025-12-01",
      preferredTime: "10:00 AM",
      vehicleType: "sedan",
    });

    // Verify booking exists
    const bookings = await testContext.query(api.bookings.getBookings, {});
    expect(bookings).toHaveLength(1);
    expect(bookings[0]._id).toBe(bookingId);

    // Update booking status
    await testContext.mutate(api.bookings.updateBookingStatus, {
      bookingId,
      status: "confirmed",
      notes: "Confirmed via integration test",
    });

    // Verify update
    const updatedBooking = await testContext.query(api.bookings.getBooking, {
      bookingId,
    });
    expect(updatedBooking?.status).toBe("confirmed");
    expect(updatedBooking?.notes).toBe("Confirmed via integration test");
  });
});
```

### End-to-End Testing

**Cypress E2E Tests**:
```typescript
// cypress/e2e/booking-flow.cy.ts
describe("Booking Flow", () => {
  beforeEach(() => {
    cy.visit("/booking");
  });

  it("allows customers to book a service", () => {
    // Fill out booking form
    cy.get('[name="name"]').type("John Doe");
    cy.get('[name="email"]').type("john@example.com");
    cy.get('[name="phone"]').type("123-456-7890");
    cy.get('[name="service"]').select("Auto Detailing");
    cy.get('[name="date"]').type("2025-12-01");
    cy.get('[name="time"]').select("10:00 AM");
    cy.get('[name="vehicleType"]').select("Sedan");
    cy.get('[name="message"]').type("This is a test booking");

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify success
    cy.contains("Booking submitted!").should("be.visible");
    cy.contains("We'll confirm your appointment within 2 hours").should("be.visible");
  });

  it("shows real-time booking updates for admin", () => {
    // Login as admin
    cy.visit("/admin/login");
    cy.get('[name="email"]').type("admin@example.com");
    cy.get('[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Navigate to bookings
    cy.visit("/admin/bookings");

    // Create booking in separate session (or via API)
    // Verify real-time update
    cy.contains("New booking request").should("be.visible");
  });
});
```

### Performance Testing

**Load Testing for Real-time Features**:
```typescript
// test/performance/real-time.test.ts
import { describe, test, expect } from "vitest";
import { api } from "@/convex/_generated/api";

describe("Real-time Performance Tests", () => {
  test("handles multiple concurrent booking requests", async () => {
    const concurrentRequests = 50;
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        testContext.mutate(api.bookings.createBooking, {
          customerName: `User ${i}`,
          customerEmail: `user${i}@example.com`,
          customerPhone: `123-456-789${i}`,
          serviceId: testServiceId,
          preferredDate: "2025-12-01",
          preferredTime: `${10 + Math.floor(i / 10)}:00 AM`,
          vehicleType: "sedan",
        })
      );
    }

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");

    expect(successful.length).toBeGreaterThan(0);
    expect(failed.length).toBeLessThan(concurrentRequests); // Some should fail due to time conflicts
  });

  test("real-time subscription performance", async () => {
    const startTime = Date.now();
    
    // Subscribe to bookings
    const subscription = api.bookings.subscribeBookings.watch({}, {});
    
    // Make multiple updates
    for (let i = 0; i < 10; i++) {
      await testContext.mutate(api.bookings.createBooking, {
        customerName: `Perf Test ${i}`,
        customerEmail: `perf${i}@example.com`,
        customerPhone: `123-456-789${i}`,
        serviceId: testServiceId,
        preferredDate: "2025-12-01",
        preferredTime: `${10 + i}:00 AM`,
        vehicleType: "sedan",
      });
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    subscription.unsubscribe();
  });
});
```

---

## 8. Deployment Configuration

### Environment Setup

**Production Environment Variables**:
```bash
# .env.production
NEXT_PUBLIC_CONVEX_URL=https://your-production-deployment.convex.cloud
CONVEX_DEPLOYMENT=prod:your-deployment-id

# Admin authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CONVEX_SITE_URL=https://1detailatatime.com

# Email notifications
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@1detailatatime.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
VERCEL_URL=https://1detailatatime.com
```

**Convex Environment Configuration**:
```typescript
// convex/prod.config.ts
export default {
  // Production-specific Convex configuration
  telemetry: {
    disabled: false,
  },
  // Enable production optimizations
  experimental: {
    optimizer: true,
  },
  // Security headers
  headers: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  },
};
```

### Database Migration Procedures

**Migration Script**:
```typescript
// convex/migrations/001_initial_schema.ts
import { defineMigration } from "@convex-dev/migrations";

export default defineMigration({
  name: "initial_schema",
  up: async (ctx) => {
    // Create initial collections
    await ctx.createCollection("services", {
      indexes: [
        { name: "by_category", fields: ["category"] },
        { name: "by_active", fields: ["isActive"] },
        { name: "by_slug", fields: ["slug"] },
      ],
    });

    await ctx.createCollection("bookings", {
      indexes: [
        { name: "by_status", fields: ["status"] },
        { name: "by_date", fields: ["preferredDate"] },
        { name: "by_customer_email", fields: ["customerEmail"] },
        { name: "by_service_date", fields: ["serviceId", "preferredDate"] },
      ],
    });

    // Insert initial service data
    const services = [
      {
        name: "Auto Detailing",
        slug: "auto-detailing",
        category: "primary",
        title: "Professional Auto Detailing",
        description: "Complete auto detailing service",
        metaDescription: "Expert auto detailing in San Antonio",
        features: ["Complete exterior wash", "Interior cleaning", "Paint protection"],
        benefits: ["Professional service", "Eco-friendly products", "Satisfaction guaranteed"],
        price: "$199+",
        duration: "3-4 hours",
        process: [],
        isActive: true,
        sortOrder: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      // ... other services
    ];

    for (const service of services) {
      await ctx.insert("services", service);
    }

    // Create admin user
    await ctx.insert("adminUsers", {
      userId: "admin_initial",
      email: "admin@1detailatatime.com",
      name: "Business Owner",
      role: "admin",
      permissions: [],
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
  down: async (ctx) => {
    // Rollback procedures
    await ctx.dropCollection("services");
    await ctx.dropCollection("bookings");
    await ctx.dropCollection("customers");
    await ctx.dropCollection("reviews");
    await ctx.dropCollection("adminUsers");
    await ctx.dropCollection("businessSettings");
  },
});
```

**Migration Runner**:
```typescript
// scripts/run-migrations.ts
import { runMigrations } from "@convex-dev/migrations/cli";

async function runProductionMigrations() {
  try {
    console.log("Starting production migrations...");
    
    await runMigrations({
      deploymentUrl: process.env.CONVEX_DEPLOYMENT!,
      migrationFiles: [
        "convex/migrations/001_initial_schema.ts",
        "convex/migrations/002_add_reviews.ts",
        // ... other migrations
      ],
    });
    
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runProductionMigrations();
```

### Production Monitoring

**Convex Monitoring Configuration**:
```typescript
// convex/monitoring.ts
import { api } from "./_generated/api";

export const logBookingActivity = Mutation(async (ctx, {
  bookingId,
  action,
  userId,
}: {
  bookingId: string;
  action: "created" | "updated" | "cancelled" | "confirmed";
  userId?: string;
}) => {
  await ctx.db.insert("activityLog", {
    bookingId,
    action,
    userId,
    timestamp: Date.now(),
    metadata: {
      userAgent: ctx.headers.get("user-agent"),
      ipAddress: ctx.headers.get("x-forwarded-for"),
    },
  });
});

export const monitorPerformance = Query(async (ctx) => {
  const recentBookings = await ctx.db
    .query("bookings")
    .filter((q) => 
      q.gte(q.field("createdAt"), Date.now() - 24 * 60 * 60 * 1000)
    )
    .collect();

  return {
    totalBookings: recentBookings.length,
    confirmedBookings: recentBookings.filter(b => b.status === "confirmed").length,
    pendingBookings: recentBookings.filter(b => b.status === "pending").length,
    averageResponseTime: "2 hours", // Calculate from actual data
    errorRate: 0, // Monitor error logs
  };
});
```

**External Monitoring Setup**:
```typescript
// lib/monitoring.ts
import * as Sentry from "@sentry/nextjs";

export function initMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}

export function logError(error: Error, context?: any) {
  Sentry.captureException(error, {
    extra: context,
  });
}

export function logPerformanceMetric(name: string, value: number) {
  Sentry.addBreadcrumb({
    message: `Performance metric: ${name}`,
    data: { value },
    category: "performance",
  });
}
```

### Backup and Disaster Recovery

**Automated Backup Strategy**:
```typescript
// scripts/backup.ts
import { api } from "../convex/_generated/api";

export async function createBackup() {
  try {
    console.log("Creating database backup...");
    
    // Export all collections
    const services = await api.services.getServices({});
    const bookings = await api.bookings.getBookings({});
    const customers = await api.customers.getCustomers({});
    const reviews = await api.reviews.getReviews({});

    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      data: {
        services,
        bookings,
        customers,
        reviews,
      },
    };

    // Store backup to secure location
    await storeBackup(backup);
    
    console.log("Backup completed successfully");
  } catch (error) {
    console.error("Backup failed:", error);
    throw error;
  }
}

async function storeBackup(backup: any) {
  // Implementation for storing backup (S3, Google Cloud, etc.)
  // This is a simplified example
  const backupString = JSON.stringify(backup, null, 2);
  
  // Upload to secure backup location
  await uploadToS3(backupString, `backups/backup-${backup.timestamp}.json`);
}
```

---

## 9. Performance Optimization

### Query Optimization

**Efficient Convex Queries**:
```typescript
// Optimized query functions
export const getBookingsByDate = Query(
  authorize(PERMISSIONS.BOOKINGS_READ),
  async (ctx, { date, limit = 50 }: { date: string; limit?: number }) => {
    // Use indexed queries for performance
    return await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("preferredDate", date))
      .order("desc") // Use createdAt for consistent ordering
      .take(limit);
  }
);

export const getCustomerHistory = Query(
  authorize(PERMISSIONS.CUSTOMERS_READ),
  async (ctx, { email }: { email: string }) => {
    // Optimize with multiple indexed queries
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_customer_email", (q) => q.eq("customerEmail", email))
      .order("desc")
      .take(50);

    const customer = await ctx.db
      .query("customers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    return { bookings, customer };
  }
);

// Pagination for large datasets
export const getPaginatedBookings = Query(
  authorize(PERMISSIONS.BOOKINGS_READ),
  async (ctx, { 
    cursor, 
    numItems = 20,
    filters = {} 
  }: { 
    cursor?: string; 
    numItems?: number; 
    filters?: any;
  }) => {
    let query = ctx.db.query("bookings");

    // Apply filters efficiently
    if (filters.status) {
      query = query.withIndex("by_status", (q) => q.eq("status", filters.status));
    }

    if (filters.dateRange) {
      query = query.filter((q) => 
        q.and(
          q.gte(q.field("preferredDate"), filters.dateRange.start),
          q.lte(q.field("preferredDate"), filters.dateRange.end)
        )
      );
    }

    // Use cursor-based pagination for performance
    const results = await query
      .order("desc")
      .paginate({ numItems, cursor });

    return {
      ...results,
      // Add metadata for frontend pagination
      hasMore: results.isDone === false,
      nextCursor: results.continueCursor,
    };
  }
);
```

### Real-time Optimization

**Optimized Subscriptions**:
```typescript
// Optimized subscription hooks
export function useOptimizedBookings(filters: any) {
  return useQuery(
    api.bookings.getBookings, 
    filters, 
    {
      // Cache results for better performance
      cacheDuration: 30000, // 30 seconds
      // Batch updates to reduce re-renders
      batchUpdates: true,
      // Enable connection pooling
      connectionPool: true,
    }
  );
}

// Debounced search for large datasets
export function useDebouncedSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        const searchResults = await searchFunction(query);
        setResults(searchResults);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, searchFunction, delay]);

  return { query, setQuery, results, isLoading };
}
```

### Frontend Performance

**Component Optimization**:
```typescript
// Optimized service components
import { memo, useMemo, useCallback } from "react";

interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
}

// Memoize expensive components
const ServiceCard = memo<ServiceCardProps>(({ service, onBook }) => {
  // Use useMemo for expensive calculations
  const serviceFeatures = useMemo(() => 
    service.features.slice(0, 3), 
    [service.features]
  );

  const handleBookClick = useCallback(() => {
    onBook(service._id);
  }, [onBook, service._id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        <CardDescription>Starting at {service.price}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          {serviceFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button onClick={handleBookClick}>
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
});

ServiceCard.displayName = "ServiceCard";
```

**Virtual Scrolling for Large Lists**:
```typescript
// Virtual scrolling for booking lists
import { FixedSizeList as List } from "react-window";

export function BookingList({ bookings }: { bookings: Booking[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <BookingItem booking={bookings[index]} />
    </div>
  );

  return (
    <List
      height={600} // Container height
      itemCount={bookings.length}
      itemSize={120} // Row height
      width="100%"
    >
      {Row}
    </List>
  );
}
```

### Caching Strategy

**Multi-level Caching**:
```typescript
// lib/cache.ts
class ConvexCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const convexCache = new ConvexCache();

// Usage in components
export function useCachedServices(category: string) {
  const cacheKey = `services_${category}`;
  
  // Check cache first
  const cached = convexCache.get(cacheKey);
  if (cached) return cached;

  // Fetch from Convex if not cached
  const services = useQuery(api.services.getServices, { category });
  
  if (services) {
    convexCache.set(cacheKey, services);
  }
  
  return services;
}
```

---

## 10. Security Considerations

### Data Validation and Sanitization

**Input Validation**:
```typescript
// convex/validators/booking.ts
import { v } from "convex/values";

export const bookingSchema = v.object({
  customerName: v.string().min(2, "Name must be at least 2 characters").max(100),
  customerEmail: v.string().email("Invalid email address"),
  customerPhone: v.string().regex(
    /^[\+]?[1-9][\d]{0,15}$/,
    "Invalid phone number format"
  ),
  serviceId: v.id("services"),
  preferredDate: v.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Invalid date format (YYYY-MM-DD)"
  ),
  preferredTime: v.string().regex(
    /^\d{1,2}:\d{2}\s?(AM|PM)$/,
    "Invalid time format"
  ),
  vehicleType: v.union(
    v.literal("sedan"),
    v.literal("suv"),
    v.literal("truck"),
    v.literal("van"),
    v.literal("coupe"),
    v.literal("sports")
  ),
  message: v.optional(v.string().max(1000, "Message too long")),
});

// Sanitization function
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+=/gi, ""); // Remove event handlers
}
```

**SQL Injection Prevention**:
```typescript
// All queries use parameterized queries through Convex
export const safeBookingQuery = Query(async (ctx, { email }: { email: string }) => {
  // Convex automatically prevents SQL injection through parameterized queries
  return await ctx.db
    .query("bookings")
    .filter((q) => q.eq(q.field("customerEmail"), email))
    .collect();
});
```

### Row Level Security (RLS)

**Security Policies**:
```typescript
// convex/security/policies.ts
import { Query, Mutation } from "../_generated/server";
import { auth } from "../auth";

// RLS policy for bookings
export const getBooking = Query(
  authorize(PERMISSIONS.BOOKINGS_READ),
  async (ctx, { bookingId }: { bookingId: string }) => {
    const user = await auth.getUser(ctx);
    const booking = await ctx.db.get(bookingId);

    if (!booking) throw new Error("Booking not found");

    // Admin can see all bookings
    const adminUser = await ctx.db
      .query("adminUsers")
      .filter((q) => q.eq(q.field("userId"), user.userId))
      .unique();

    if (adminUser?.role === "admin") {
      return booking;
    }

    // Customers can only see their own bookings
    if (user.email === booking.customerEmail) {
      return booking;
    }

    throw new Error("Access denied");
  }
);

// Rate limiting implementation
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

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

// Usage in mutations
export const createBooking = Mutation(
  async (ctx, bookingData: any) => {
    const userIp = ctx.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `booking_${userIp}`;

    // Apply rate limiting (max 5 bookings per hour per IP)
    if (!rateLimit(rateLimitKey, 5, 60 * 60 * 1000)) {
      throw new Error("Too many booking attempts. Please try again later.");
    }

    // Validate input
    const validatedData = bookingSchema.parse(bookingData);
    
    // Sanitize input
    validatedData.customerName = sanitizeInput(validatedData.customerName);
    validatedData.message = validatedData.message ? 
      sanitizeInput(validatedData.message) : undefined;

    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      ...validatedData,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return bookingId;
  }
);
```

### Authentication Security

**Secure Session Management**:
```typescript
// convex/auth/secureAuth.ts
import { auth } from "../auth";
import { v } from "convex/values";

export const secureLogin = Mutation(async (ctx, {
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  // Rate limiting
  const clientIp = ctx.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`login_${clientIp}`, 5, 15 * 60 * 1000)) {
    throw new Error("Too many login attempts. Please try again later.");
  }

  // Validate credentials
  const adminUser = await ctx.db
    .query("adminUsers")
    .filter((q) => q.eq(q.field("email"), email))
    .unique();

  if (!adminUser || !adminUser.isActive) {
    // Prevent user enumeration
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await verifyPassword(password, adminUser.passwordHash);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  // Update last login
  await ctx.db.patch(adminUser._id, {
    lastLoginAt: Date.now(),
  });

  // Create session
  const sessionId = await createSecureSession(ctx, adminUser.userId);
  
  return { sessionId, user: { email: adminUser.email, role: adminUser.role } };
});

async function createSecureSession(ctx: any, userId: string): Promise<string> {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36)}`;
  
  await ctx.db.insert("sessions", {
    sessionId,
    userId,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    createdAt: Date.now(),
  });

  return sessionId;
}
```

### CORS and Security Headers

**Security Headers Configuration**:
```typescript
// next.config.ts
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.convex.cloud;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim()
  }
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // Additional security configurations
  experimental: {
    // Enable additional security features
    cpus: 1, // Limit resource usage
  },
  // Enable strict mode for development
  reactStrictMode: true,
  // Disable source maps in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
```

### Data Encryption

**Sensitive Data Handling**:
```typescript
// lib/encryption.ts
import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secretKey = process.env.ENCRYPTION_KEY!;

// Encrypt sensitive data
export function encryptSensitiveData(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey);
  cipher.setAAD(Buffer.from("additional-data"));
  
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

// Decrypt sensitive data
export function decryptSensitiveData(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":");
  
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = crypto.createDecipher(algorithm, secretKey);
  decipher.setAAD(Buffer.from("additional-data"));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

// Hash passwords securely
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  const salt = await crypto.randomBytes(32);
  const hash = await crypto.scrypt(password, salt, 64);
  
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

// Verify passwords
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [saltHex, storedHashHex] = storedHash.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const storedHashBuffer = Buffer.from(storedHashHex, "hex");
  
  const hash = await crypto.scrypt(password, salt, 64);
  
  return crypto.timingSafeEqual(hash, storedHashBuffer);
}
```

---

## Conclusion

This comprehensive technical implementation plan provides a roadmap for integrating Convex database with the One Detail At A Time auto detailing website. The plan focuses on core functionality including:

- **Complete booking management system** with real-time updates
- **Customer data management** with guest booking support
- **Admin dashboard** for business operations
- **Security-first approach** with authentication and data protection
- **Performance optimization** for scalability
- **Comprehensive testing strategy** for reliability

The implementation follows modern best practices and provides a solid foundation for future enhancements such as customer accounts, payment processing, and advanced notification systems.

**Next Steps:**
1. Review and approve this implementation plan
2. Begin with Phase 1 (Database Setup & Schema)
3. Follow the phased timeline for systematic development
4. Regular testing and validation throughout the process

This plan ensures a robust, secure, and scalable backend solution that will transform the current static website into a dynamic, real-time auto detailing business management platform.
