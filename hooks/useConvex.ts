"use client";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";

// Booking hooks
export function useBookings(filters?: {
  status?: string;
  date?: string;
  serviceId?: string;
  customerEmail?: string;
  limit?: number;
}) {
  const bookings = useQuery(api.bookings.getAllBookingsAdmin, filters || {});
  const [isLoading, setIsLoading] = useState(true);

  const { query } = useConvex();

  useEffect(() => {
    if (bookings !== undefined) {
      setIsLoading(false);
    }
  }, [bookings]);

  const refetch = () => {
    query.invalidateQueries();
  };

  return {
    bookings: bookings || [],
    isLoading,
    refetch,
  };
}

export function useBookingMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBooking = useMutation(api.bookings.createBooking);
  const updateBookingStatus = useMutation(api.bookings.updateBookingStatus);
  const cancelBooking = useMutation(api.bookings.cancelBooking);

  const handleCreateBooking = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      return await createBooking(bookingData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
    setIsSubmitting(true);
    try {
      await updateBookingStatus({ bookingId, status, notes });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string, reason?: string) => {
    setIsSubmitting(true);
    try {
      await cancelBooking({ bookingId, reason });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createBooking: handleCreateBooking,
    updateBookingStatus: handleUpdateBookingStatus,
    cancelBooking: handleCancelBooking,
    isSubmitting,
  };
}

// Service hooks
export function useServices(filters?: {
  category?: "primary" | "additional";
  isActive?: boolean;
  limit?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);

  const services = useQuery(api.services.getServices, filters || {});
  const { query } = useConvex();

  useEffect(() => {
    if (services !== undefined) {
      setIsLoading(false);
    }
  }, [services]);

  return {
    services: services || [],
    isLoading,
    refetch: () => window.location.reload(),
  };
}

export function useServiceBySlug(slug: string) {
  return useQuery(api.services.getServiceBySlug, { slug });
}

export function useActiveServices() {
  return useQuery(api.services.getActiveServices, {});
}

// Available time slots hook
export function useAvailableTimeSlots(date: string, serviceId: string) {
  return useQuery(api.bookings.getAvailableTimeSlots, { date, serviceId });
}

// Booking statistics hook (admin only)
export function useBookingStats() {
  return useQuery(api.bookings.getBookingStats, {});
}

// Service statistics hook (admin only)
export function useServiceStats() {
  return useQuery(api.services.getServiceStats, {});
}

// Real-time booking updates
export function useRealTimeBookings(date?: string) {
  const { query } = useConvex();

  // Subscribe to booking updates (this would be implemented with Convex subscriptions)
  useEffect(() => {
    // In a real implementation, this would set up a subscription
    // For now, we'll just useQuery; queries periodically
    const interval = setInterval(() => {
      // Trigger a re-render for real-time updates
      window.location.reload();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [query]);

  return useBookings(date ? { date } : {});
}

// Customer booking history hook
export function useCustomerBookingHistory(email: string) {
  return useQuery(api.bookings.getCustomerBookingHistory, { email });
}

// Form validation hook
export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "customerName":
        if (!value || value.trim().length < 2) {
          newErrors[name] = "Name must be at least 2 characters";
        } else {
          delete newErrors[name];
        }
        break;

      case "customerEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          newErrors[name] = "Please enter a valid email address";
        } else {
          delete newErrors[name];
        }
        break;

      case "customerPhone":
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = value.replace(/[\D]/g, '');
        if (!value || cleanPhone.length < 10) {
          newErrors[name] = "Please enter a valid phone number";
        } else {
          delete newErrors[name];
        }
        break;

      case "preferredDate":
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!value || !dateRegex.test(value)) {
          newErrors[name] = "Please select a valid date";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            newErrors[name] = "Please select a future date";
          } else {
            delete newErrors[name];
          }
        }
        break;

      case "preferredTime":
        const timeRegex = /^\d{1,2}:\d{2}\s?(AM|PM)$/i;
        if (!value || !timeRegex.test(value)) {
          newErrors[name] = "Please select a valid time";
        } else {
          delete newErrors[name];
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const validateForm = (formData: Record<string, any>) => {
    let isValid = true;
    const requiredFields = ["customerName", "customerEmail", "customerPhone", "preferredDate", "preferredTime"];

    for (const field of requiredFields) {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    }

    return isValid;
  };

  const clearErrors = () => setErrors({});

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
}

// Loading states hook
export function useLoadingState() {
  const [globalLoading, setGlobalLoading] = useState(false);

  const withLoading = async <T>(promise: Promise<T>): Promise<T> => {
    setGlobalLoading(true);
    try {
      return await promise;
    } finally {
      setGlobalLoading(false);
    }
  };

  return {
    globalLoading,
    setGlobalLoading,
    withLoading,
  };
}

// Error handling hook
export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    console.error("Convex Error:", error);

    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === "string") {
      setError(error);
    } else {
      setError("An unexpected error occurred");
    }

    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  const clearError = () => setError(null);

  return {
    error,
    handleError,
    clearError,
  };
}

// Connection status hook
export function useConnectionStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isConnected };
}

// Notification hooks (would integrate with your notification system)
export function useNotifications() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    timestamp: number;
  }>>([]);

  const addNotification = (notification: Omit<typeof notifications[0], "id" | "timestamp">) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = {
      ...notification,
      id,
      timestamp: Date.now(),
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}
