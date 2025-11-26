"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import { Label } from "@radix-ui/react-label";
import { Input, Textarea } from "./formElements";
import { toast } from "sonner";


/**
 * A form component for sending messages to One Detail At A Time.
 * Accepts name, email, phone, service, and message fields.
 * Uses the `useToast` hook from `@/components/ui/toast` to display toast messages.
 * Submits the form data to a Google Forms submission URL (replace with your own).
 */


export function ContactForm() {
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
            message: formData.get("message"),
        };

        // Google Forms submission URL
        const googleFormsUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse";

        try {
            // Simulate form submission - replace with actual Google Forms integration
            await new Promise(resolve => setTimeout(resolve, 1000));

            showToast({
                title: "Message sent!",
                description: "We'll get back to you within 24 hours.",
            });

            (event.target as HTMLFormElement).reset();
        } catch (error) {
            showToast({
                title: "Error",
                description: "Failed to send message. Please try again or call us directly.",
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
                    <Label htmlFor="service">Service</Label>
                    <select
                        id="service"
                        name="service"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.name}>
                                {service.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your vehicle and what you need..."
                    required
                    rows={5}
                />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}

function showToast(arg0: { title: string; description: string; variant?: "destructive" }) {
    if (arg0.variant === "destructive") {
        toast.error(arg0.title, { description: arg0.description });
    } else {
        toast.success(arg0.title, { description: arg0.description });
    }
}
