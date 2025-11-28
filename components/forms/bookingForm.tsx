"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input, Textarea } from "./formElements";
import { toast } from "sonner";
import { useServices, useBookingMutations, useFormValidation, useErrorHandler } from "@/hooks/useConvex";
import type { ServiceData } from "../../convex/types";

/**
 * A form component for booking appointments with One Detail At A Time.
 * Accepts name, email, phone, service, date, time, vehicle type, and message fields.
 * Uses modern Sonner toast notifications for user feedback.
 */

export function BookingForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const searchParams = useSearchParams();
    const preselectedService = searchParams?.get("service");
    
    // Get services from Convex
    const { services, isLoading: servicesLoading } = useServices({ isActive: true });
    const { createBooking, isSubmitting: mutationSubmitting } = useBookingMutations();
    const { validateForm, errors, clearErrors } = useFormValidation();
    const { handleError } = useErrorHandler();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        clearErrors();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            customerName: formData.get("name")?.toString() || "",
            customerEmail: formData.get("email")?.toString() || "",
            customerPhone: formData.get("phone")?.toString() || "",
            serviceId: formData.get("service")?.toString() || "",
            preferredDate: formData.get("date")?.toString() || "",
            preferredTime: formData.get("time")?.toString() || "",
            vehicleType: formData.get("vehicleType")?.toString() as any || "",
            message: formData.get("message")?.toString() || "",
        };

        // Validate form using the custom hook
        if (!validateForm(data)) {
            toast.error("Please fix the errors above", {
                description: "Check the form fields for invalid input.",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Submit to Convex backend
            const bookingId = await createBooking({
                customerName: data.customerName,
                customerEmail: data.customerEmail,
                customerPhone: data.customerPhone,
                serviceId: data.serviceId,
                preferredDate: data.preferredDate,
                preferredTime: data.preferredTime,
                vehicleType: data.vehicleType,
                message: data.message || undefined,
            });

            toast.success("Booking submitted successfully!", {
                description: `Your booking ID is ${bookingId}. We'll confirm your appointment within 2 hours.`,
            });

            // Reset form
            (event.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Booking submission error:", error);
            handleError(error);
            
            toast.error("Booking failed", {
                description: "Please try again or call us directly at (726) 207-1007.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Find the preselected service if specified
    const selectedService = preselectedService
        ? services?.find((s: ServiceData) => s.slug === preselectedService)
        : null;

    if (servicesLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        required
                        className={errors.customerName ? "border-red-500" : ""}
                    />
                    {errors.customerName && (
                        <p className="text-sm text-red-500">{errors.customerName}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className={errors.customerEmail ? "border-red-500" : ""}
                    />
                    {errors.customerEmail && (
                        <p className="text-sm text-red-500">{errors.customerEmail}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(210) 555-0123"
                        required
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
                        name="vehicleType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

            <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <select
                    id="service"
                    name="service"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                    defaultValue={selectedService?._id || ""}
                >
                    <option value="">Select a service</option>
                    {services?.map((service: ServiceData) => (
                        <option key={service._id} value={service._id}>
                            {service.name} - {service.price}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date *</Label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className={errors.preferredDate ? "border-red-500" : ""}
                    />
                    {errors.preferredDate && (
                        <p className="text-sm text-red-500">{errors.preferredDate}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <select
                        id="time"
                        name="time"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                    >
                        <option value="">Select time</option>
                        <option value="7:00 AM">7:00 AM</option>
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                        <option value="10:00 PM">10:00 PM</option>
                    </select>
                    {errors.preferredTime && (
                        <p className="text-sm text-red-500">{errors.preferredTime}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Additional Notes</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Any specific requests or concerns?"
                    rows={4}
                />
            </div>

            <Button 
                type="submit" 
                size="lg" 
                className="w-full" 
                disabled={isSubmitting || mutationSubmitting || servicesLoading}
            >
                {(isSubmitting || mutationSubmitting) ? "Submitting..." : "Book Appointment"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to our terms. We'll confirm your appointment via phone or email.
            </p>
        </form>
    );
}