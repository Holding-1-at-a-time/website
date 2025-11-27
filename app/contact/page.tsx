import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Contact Us - One Detail At A Time | Professional Auto Detailing San Antonio",
    description: "Contact One Detail At A Time for professional auto detailing services in San Antonio, TX. Get your free quote today! Serving Stone Oak, Alamo Heights, and all SA areas.",
    openGraph: {
        title: "Contact One Detail At A Time | Professional Auto Detailing San Antonio",
        description: "Contact One Detail At A Time for professional auto detailing services in San Antonio, TX. Get your free quote today!",
        type: "website",
        url: "https://1detailatatime.com/contact",
    },
    alternates: {
        canonical: "https://1detailatatime.com/contact",
    },
};

export default function ContactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "One Detail At A Time",
        "image": "https://1detailatatime.com/logo.png",
        "telephone": "(726) 207-1007",
        "email": "rromerojr1@gmail.com",
        "url": "https://1detailatatime.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "11692 Bricken Circle",
            "addressLocality": "San Antonio",
            "addressRegion": "TX",
            "postalCode": "78233",
            "addressCountry": "US"
        },
        "areaServed": [
            {
                "@type": "City",
                "name": "San Antonio"
            },
            {
                "@type": "Neighborhood", 
                "name": "Stone Oak"
            },
            {
                "@type": "Neighborhood",
                "name": "Alamo Heights"
            },
            {
                "@type": "Neighborhood",
                "name": "North Side"
            }
        ],
        "openingHours": [
            "Mo-Fr 08:00-18:00",
            "Sa 09:00-17:00",
            "Su 10:00-16:00"
        ],
        "priceRange": "$39-$399+"
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="flex flex-col">
                {/* Hero Section */}
                <section className="py-12 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-background">
                    <div className="container">
                        <div className="text-center max-w-3xl mx-auto space-y-6">
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                Get Your Free Quote Today
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Ready to give your vehicle the professional care it deserves? 
                                Contact us for your free quote and experience IDA certified auto detailing in San Antonio.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Form and Info */}
                <section className="py-16">
                    <div className="container">
                        <div className="grid gap-12 lg:grid-cols-2">
                            {/* Contact Form */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                                        <p className="text-muted-foreground">
                                            Fill out the form below and we'll get back to you within 24 hours with your free quote.
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <ContactForm />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                                    <p className="text-muted-foreground mb-8">
                                        We're here to help with all your auto detailing needs. 
                                        Contact us today for professional service throughout San Antonio and surrounding areas.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Phone className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Phone</h3>
                                            <p className="text-muted-foreground">(726) 207-1007</p>
                                            <p className="text-sm text-muted-foreground">
                                                Call us during business hours for immediate assistance
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Email</h3>
                                            <p className="text-muted-foreground">rromerojr1@gmail.com</p>
                                            <p className="text-sm text-muted-foreground">
                                                Send us an email anytime, we'll respond within 24 hours
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Service Area</h3>
                                            <p className="text-muted-foreground">San Antonio, TX & Surrounding Areas</p>
                                            <p className="text-sm text-muted-foreground">
                                                Mobile service - we come to you! Serving Stone Oak, Alamo Heights, North Side, and all San Antonio areas.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Clock className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Business Hours</h3>
                                            <div className="text-muted-foreground space-y-1">
                                                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                                                <p>Saturday: 9:00 AM - 5:00 PM</p>
                                                <p>Sunday: 10:00 AM - 4:00 PM</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Emergency service available by appointment
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Areas with Map */}
                <section className="py-16">
                    <div className="container">
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Service Areas List */}
                            <Card className="bg-muted/50">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-lg mb-4">Areas We Serve</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {[
                                            "Stone Oak",
                                            "Alamo Heights",
                                            "North Side",
                                            "Downtown",
                                            "Medical Center",
                                            "Northwest Side",
                                            "Northeast Side",
                                            "Southtown",
                                            "Pearl District",
                                            "Terrell Hills",
                                            "Encino Park",
                                            "Hollywood Park"
                                        ].map((area) => (
                                            <div key={area} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                <span>{area}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Map Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Our Service Location</CardTitle>
                                    <p className="text-muted-foreground">
                                        Based in San Antonio, we provide mobile service throughout the city
                                    </p>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="relative h-64 w-full">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110551.5312345678!2d-98.6!3d29.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x865c8e1b12345678%3A0x123456789abcdef0!2sSan%20Antonio%2C%20TX!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                                            width="100%"
                                            height="256"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            className="rounded-b-lg"
                                            title="San Antonio Service Area"
                                        />
                                    </div>
                                    <div className="p-4 bg-muted/30">
                                        <p className="text-sm text-muted-foreground text-center">
                                            Mobile service throughout San Antonio, TX • 
                                            <span className="font-medium">Stone Oak • Alamo Heights • North Side</span> • and all SA areas
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-muted/50">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">Quick answers to common questions about our services</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">How quickly can you respond to my request?</h3>
                                    <p className="text-muted-foreground">
                                        We typically respond to all inquiries within 2-4 hours during business hours, 
                                        and within 24 hours on weekends or holidays.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">Do you provide mobile service?</h3>
                                    <p className="text-muted-foreground">
                                        Yes! We come directly to your location anywhere in San Antonio. 
                                        This is our primary service method for your convenience.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">What's included in your free quote?</h3>
                                    <p className="text-muted-foreground">
                                        Our free quote includes detailed pricing based on your vehicle type, 
                                        service needs, and current condition, plus service time estimates.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="font-semibold mb-2">Are you licensed and insured?</h3>
                                    <p className="text-muted-foreground">
                                        Yes, we are fully licensed, insured, and IDA certified. 
                                        Your vehicle and property are fully protected during our service.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </article>
        </>
    );
}