"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import { Label } from "@radix-ui/react-label";
import { Input, Textarea } from "./formElements";
import { toast } from "sonner";

/**
 * A form component for booking appointments with One Detail At A Time.
 * Accepts name, email, phone, service, date, time, vehicle type, and message fields.
 * Uses modern Sonner toast notifications for user feedback.
 */

export function BookingForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            service: formData.get("service"),
            date: formData.get("date"),
            time: formData.get("time"),
            vehicleType: formData.get("vehicleType"),
            message: formData.get("message"),
        };

        // Google Calendar/Forms integration URL
        const googleCalendarUrl = "https://calendar.google.com/calendar/appointments/YOUR_BOOKING_ID";

        try {
            // Simulate form submission - replace with actual Google Calendar/Forms integration
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Booking submitted!", {
                description: "We'll confirm your appointment within 2 hours.",
            });

            (event.target as HTMLFormElement).reset();
        } catch (error) {
            toast.error("Error", {
                description: "Failed to submit booking. Please try again or call us directly.",
            });
        } finally {
            setIsSubmitting(false);
        }
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
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                    />
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
                    />
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
                >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.name}>
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
                    />
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

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Book Appointment"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to our terms. We'll confirm your appointment via phone or email.
            </p>
        </form>
    );
}