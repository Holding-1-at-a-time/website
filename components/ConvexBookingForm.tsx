"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActiveServices, useAvailableTimeSlots, useBookings, useBookingStats, useErrorHandler, useFormValidation, useLoadingState, useServiceStats } from "@/hooks/useConvex";
import { CheckCircle, Clock, Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

/**
 * Enhanced Booking Form with Convex Integration
 * 
 * This component demonstrates the complete Convex database integration:
 * - Dynamic service loading from Convex database
 * - Real-time available time slots
 * - Form validation with error handling
 * - Optimistic UI updates
 * - Success/error notifications
 * 
 * @example
 * ```tsx
 * <ConvexBookingForm />
 * ```
 */
export function ConvexBookingForm() {
  // State management
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    preferredDate: "",
    preferredTime: "",
    vehicleType: "",
    message: "",
  });

  const [selectedService, setSelectedService] = useState<any>(null);

  // Convex hooks
  const { services, isLoading: servicesLoading } = useActiveServices();
  const { availableSlots, isLoading: slotsLoading } = useAvailableTimeSlots(
    formData.preferredDate,
    formData.serviceId
  );

  // Utility hooks
  const { errors, validateField, validateForm } = useFormValidation();
  const { withLoading } = useLoadingState();
  const { handleError } = useErrorHandler();

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate field on change
    validateField(field, value);

    // Handle service selection
    if (field === "serviceId") { // Parameter 's' implicitly has an 'any' type.
      const service = services.find((s: { _id: string; }) => s._id === value);
      setSelectedService(service || null);
      // Clear time slots when service changes
      if (field === "serviceId") {
        setFormData(prev => ({ ...prev, preferredTime: "" }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm(formData)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      // This would call the Convex mutation in a real implementation
      const bookingData = {
        ...formData,
        serviceId: formData.serviceId, // This would be the Convex document ID
      };

      await withLoading(
        // In real implementation: createBooking(bookingData)
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ bookingId: "demo_booking_id" });
          }, 2000); // Simulate API call
        })
      );

      toast.success("Booking submitted successfully!", {
        description: "We'll confirm your appointment within 2 hours.",
      });

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        serviceId: "",
        preferredDate: "",
        preferredTime: "",
        vehicleType: "",
        message: "",
      });
      setSelectedService(null);

    } catch (error) {
      handleError(error);
      toast.error("Booking failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Book Your Auto Detailing Service</h2>
        <p className="text-muted-foreground">
          Professional IDA certified auto detailing in San Antonio, TX
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span className="text-sm">(726) 207-1007</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          <span className="text-sm">rromerojr1@gmail.com</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-sm">San Antonio, TX</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                placeholder="John Doe"
                className={errors.customerName ? "border-red-500" : ""}
              />
              {errors.customerName && (
                <p className="text-sm text-red-500">{errors.customerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                placeholder="john@example.com"
                className={errors.customerEmail ? "border-red-500" : ""}
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-500">{errors.customerEmail}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                placeholder="(210) 555-0123"
                className={errors.customerPhone ? "border-red-500" : ""}
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-500">{errors.customerPhone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <select
                id="vehicleType"
                value={formData.vehicleType}
                onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select vehicle type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="coupe">Coupe</option>
                <option value="sports">Sports Car</option>
              </select>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Service Selection</h3>

          <div className="space-y-2">
            <Label htmlFor="serviceId">Select Service *</Label>
            <select
              id="serviceId"
              value={formData.serviceId}
              onChange={(e) => handleInputChange("serviceId", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Choose a service...</option>
              {services.map((service: { _id: string; name: string; price: string; duration: string; }) => (
                <option key={service._id} value={service._id}>
                  {service.name} - {service.price} ({service.duration})
                </option>
              ))}
            </select>
          </div>

          {/* Selected Service Details */}
          {selectedService && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">{selectedService.name}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Duration: {selectedService.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Starting at {selectedService.price}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedService.description}
              </p>
            </div>
          )}
        </div>

        {/* Date and Time Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scheduling</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date *</Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className={errors.preferredDate ? "border-red-500" : ""}
              />
              {errors.preferredDate && (
                <p className="text-sm text-red-500">{errors.preferredDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">Preferred Time *</Label>
              {formData.preferredDate && formData.serviceId ? (
                slotsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading available times...
                  </div>
                ) : (
                  <select
                    id="preferredTime"
                    value={formData.preferredTime}
                    onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select time...</option>
                    {availableSlots?.map((slot: string) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                )
              ) : (
                <Input
                  id="preferredTime"
                  disabled
                  placeholder="Select date and service first"
                  className="bg-muted"
                />
              )}
              {errors.preferredTime && (
                <p className="text-sm text-red-500">{errors.preferredTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label htmlFor="message">Additional Notes</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Any specific requests or concerns about your vehicle?"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={Object.keys(errors).length > 0}
        >
          Book Appointment
        </Button>

        {/* Terms and Conditions */}
        <p className="text-sm text-muted-foreground text-center">
          By submitting this form, you agree to our terms. We'll confirm your appointment via phone or email.
          Valet service available for an additional $50.
        </p>
      </form>
    </div>
  );
}

/**
 * Admin Dashboard Component
 * 
 * Demonstrates admin-only functionality:
 * - Booking management with real-time updates
 * - Service statistics
 * - Customer management
 */
export function AdminDashboard() {
  const { bookings, isLoading: bookingsLoading } = useBookings({ limit: 50 });
  const { stats } = useBookingStats();
  const { services: serviceStats } = useServiceStats();

  if (bookingsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-600">{stats?.total || 0}</p>
        </div>
        <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900">Confirmed</h3>
          <p className="text-2xl font-bold text-green-600">{stats?.confirmed || 0}</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900">Today</h3>
          <p className="text-2xl font-bold text-purple-600">{stats?.today || 0}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Bookings</h2>
        <div className="bg-white rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Service</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date & Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.slice(0, 10).map((booking: { _id: React.Key | null | undefined; customerName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; serviceId: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; preferredDate: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; preferredTime: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; customerPhone: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                  <tr key={booking._id}>
                    <td className="px-4 py-2 text-sm">{booking.customerName}</td>
                    <td className="px-4 py-2 text-sm">{booking.serviceId}</td>
                    <td className="px-4 py-2 text-sm">
                      {booking.preferredDate} at {booking.preferredTime}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${booking.status === "confirmed" ? "bg-green-100 text-green-800" :
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{booking.customerPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
