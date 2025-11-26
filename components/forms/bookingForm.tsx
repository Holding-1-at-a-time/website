"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form-elements";
import { Toast } from "@/components/ui/sonner";
import { services } from "@/lib/data";


function useToast(): { toast: any; } {
    // Minimal toast implementation for client-side usage.
    // Returns an object with a `toast` function that accepts an options object
    // with optional title, description, and variant properties.
    const toast = React.useCallback((opts: { title?: string; description?: string; variant?: string } = {}) => {
        const title = opts.title ?? "";
        const description = opts.description ?? "";
        const variant = opts.variant ?? "";

        if (typeof window !== "undefined" && document && document.body) {
            const message = title + (description ? "\n" + description : "");

            const el = document.createElement("div");
            el.textContent = message;
            Object.assign(el.style, {
                position: "fixed",
                right: "20px",
                top: "20px",
                maxWidth: "320px",
                whiteSpace: "pre-wrap",
                background: variant === "destructive" ? "#ef4444" : "#111827",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "8px",
                zIndex: "9999",
                boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                transition: "opacity 0.3s ease",
            });

            document.body.appendChild(el);

            // auto remove after 3s
            setTimeout(() => {
                el.style.opacity = "0";
                setTimeout(() => el.remove(), 300);
            }, 3000);
        } else {
            // Fallback to console when document isn't available
            // eslint-disable-next-line no-console
            console.log("Toast:", { title, description, variant });
        }
    }, []);

    return { toast };
}


export function BookingForm() {
    const { toast } = useToast();
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

            toast({
                title: "Booking submitted!",
                description: "We'll confirm your appointment within 2 hours.",
            });

            (event.target as HTMLFormElement).reset();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit booking. Please try again or call us directly.",
                variant: "destructive",
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
