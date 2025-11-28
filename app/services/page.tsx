'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useServices } from "@/hooks/useConvex";
import { ArrowRight, CheckCircle, Clock, DollarSign, MapPin, Star } from "lucide-react";

export default function ServicesPage() {
    // Fetch services from Convex backend
    const { services: primaryServices, isLoading: primaryLoading } = useServices({ category: 'primary', isActive: true });
    const { services: additionalServices, isLoading: additionalLoading } = useServices({ category: 'additional', isActive: true });

    // Show loading state
    if (primaryLoading && additionalLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading services...</p>
                </div>
            </div>
        );
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Auto Detailing Services",
        "description": "Professional auto detailing services throughout San Antonio, TX",
        "provider": {
            "@type": "LocalBusiness",
            "name": "One Detail At A Time",
            "image": "https://1detailatatime.com/logo.png",
            "telephone": "(726) 207-1007",
            "email": "rromerojr1@gmail.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "11692 Bricken Circle",
                "addressLocality": "San Antonio",
                "addressRegion": "TX",
                "postalCode": "78233",
                "addressCountry": "US"
            },
            "areaServed": {
                "@type": "City",
                "name": "San Antonio"
            }
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
        ]
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
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
                                <MapPin className="w-4 h-4 text-primary mr-2" />
                                <span>Serving San Antonio, TX</span>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                                Expert Auto Detailing Services in San Antonio
                            </h1>

                            <p className="text-lg text-muted-foreground">
                                San Antonio's trusted IDA certified auto detailing professionals.
                                Professional studio services for Stone Oak, Alamo Heights, North Side, and all San Antonio areas.
                                From ceramic coating to interior detailing, we deliver showroom-quality results.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild>
                                    <Link href="/booking">
                                        Book Now
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/contact">
                                        Get Free Quote
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Primary Services Section */}
                <section className="py-16">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Our Premium Services</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Comprehensive auto detailing services to keep your vehicle looking its best
                            </p>
                        </div>

                        {/* Primary Services Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {primaryServices && primaryServices.length > 0 ? (
                                primaryServices.map((service: any) => (
                                    <Card key={service._id} className="group hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-semibold">{service.name}</h3>
                                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Premium</span>
                                                </div>

                                                <p className="text-muted-foreground">{service.description}</p>

                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4 text-primary" />
                                                        <span className="font-semibold">{service.price}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4 text-primary" />
                                                        <span>{service.duration}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="font-medium text-sm">What's Included:</p>
                                                    <ul className="text-sm text-muted-foreground space-y-1">
                                                        {service.features.slice(0, 3).map((feature: string, idx: number) => (
                                                            <li key={idx} className="flex items-center gap-2">
                                                                <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                                                                <span>{feature}</span>
                                                            </li>
                                                        ))}
                                                        {service.features.length > 3 && (
                                                            <li className="text-primary text-xs">
                                                                +{service.features.length - 3} more features
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>

                                                <Button asChild className="w-full">
                                                    <Link href={`/services/${service.slug}`}>
                                                        Learn More
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-muted-foreground">No primary services available at this time.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Additional Services Section */}
                {additionalServices && additionalServices.length > 0 && (
                    <section className="py-16 bg-muted/50">
                        <div className="container">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Specialized services to meet your specific needs
                                </p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {additionalServices.map((service: any) => (
                                    <Card key={service._id} className="group hover:shadow-lg transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-xl font-semibold">{service.name}</h3>
                                                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">Additional</span>
                                                </div>

                                                <p className="text-muted-foreground">{service.description}</p>

                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-4 w-4 text-primary" />
                                                        <span className="font-semibold">{service.price}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4 text-primary" />
                                                        <span>{service.duration}</span>
                                                    </div>
                                                </div>

                                                <Button asChild className="w-full" variant="outline">
                                                    <Link href={`/services/${service.slug}`}>
                                                        Learn More
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Why Choose Us Section */}
                <section className="py-16">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Why Choose One Detail At A Time?</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                We're not just another car wash - we're IDA certified professionals
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                                    <Star className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold">IDA Certified</h3>
                                <p className="text-muted-foreground">International Detailing Association certified professionals</p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                                    <MapPin className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold">Valet Service</h3>
                                <p className="text-muted-foreground">We offer a valet service for an added cost of $50. We will pick up and drop off your vehicle at any location and destination stated by you.</p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold">Licensed & Insured</h3>
                                <p className="text-muted-foreground">Fully licensed and insured for your peace of mind</p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                                    <ArrowRight className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold">Satisfaction Guaranteed</h3>
                                <p className="text-muted-foreground">100% satisfaction guarantee on all our services</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Areas */}
                <section className="py-16 bg-muted/50">
                    <div className="container">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">
                                Serving San Antonio & Surrounding Areas
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Professional auto detailing services throughout San Antonio and all surrounding communities.
                                Professional studio with same-day service available.
                            </p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-center">
                            {["Downtown San Antonio", "Stone Oak", "Alamo Heights", "North Side", "Medical Center", "The Pearl District", "Terrell Hills", "Encino Park", "Castle Hills", "Hollywood Park", "Windcrest", "Live Oak"].map((area) => (
                                <Card key={area}>
                                    <CardContent className="p-4">
                                        <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                                        <p className="font-medium">{area}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-primary text-primary-foreground">
                    <div className="container">
                        <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                Ready to Transform Your Vehicle?
                            </h2>
                            <p className="text-lg text-primary-foreground/90">
                                Get your free quote today and experience the difference professional detailing makes
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" variant="secondary" asChild>
                                    <Link href="/booking">
                                        Schedule Service
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="text-primary bg-primary-foreground" asChild>
                                    <Link href="/contact">
                                        Get Free Quote
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        </>
    );
}