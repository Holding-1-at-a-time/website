import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useServiceBySlug } from "@/hooks/useConvex";
import { ArrowRight, CheckCircle, Clock, DollarSign, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Generates metadata for a service page.
 *
 * @param {PageProps} props - props passed to the page component.
 * @returns {Promise<Metadata>} - a promise that resolves to the metadata for the page.
 */

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  // For server-side metadata generation, we'll use a default approach
  // since we can't call hooks in generateMetadata
  return {
    title: `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | One Detail At A Time`,
    description: `Professional ${slug} services in San Antonio, TX. IDA certified auto detailing with valet service available.`,
  };
}

/**
 * A page component for a service page.
 *
 * @param {PageProps} props - props passed to the page component.
 * @returns {JSX.Element} - the JSX element for the page.
 *
 * The page component renders a hero section with the service name, description, and price.
 * It also renders a features section with the service's features and a benefits section with the service's benefits.
 * Additionally, it renders a process section with the service's process steps and a service areas section with the areas served by the service.
 * Finally, it renders a call-to-action (CTA) section with a link to book the service and a link to get a free quote.
 */
export default function ServicePage({ params }: PageProps) {
  const { slug } = params;
  const { service, isLoading } = useServiceBySlug(slug);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading service...</p>
        </div>
      </div>
    );
  }

  // Handle service not found
  if (!service) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
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
      },
      "priceRange": service.price
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
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "USD"
    }
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
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-primary mr-2" />
                  <span>Serving San Antonio, TX</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  {service.name}
                </h1>

                <p className="text-lg text-muted-foreground">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{service.price}</span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href={`/booking?service=${service.slug}`}>
                      Book This Service
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="tel:7262071007">
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {/* Placeholder for service image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground">Service Image</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">What's Included</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {service.features.map((feature: string, idx: number) => (
                <Card key={feature}>
                  <CardContent className="flex items-start gap-4 p-6">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p>{feature}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        {service.benefits && service.benefits.length > 0 && (
          <section className="py-16 bg-muted/50">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Why Choose Our {service.name}?</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {service.benefits.map((benefit: string) => (
                  <Card key={benefit}>
                    <CardContent className="p-6">
                      <CheckCircle className="h-8 w-8 text-primary mb-4" />
                      <p className="font-medium">{benefit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Process Section */}
        {service.process && service.process.length > 0 && (
          <section className="py-16">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Process</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {service.process.map((step: { step: string; title: string; description: string }) => (
                  <div key={step.step} className="relative">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Service Areas */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Serving San Antonio & Surrounding Areas
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-center">
              {["Stone Oak", "Alamo Heights", "North Side", "Downtown", "Medical Center", "Northwest Side", "Northeast Side", "All San Antonio Areas"].map((area) => (
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
                Ready to Book Your {service.name}?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Get your free quote today and experience IDA certified professional detailing
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href={`/booking?service=${service.slug}`}>
                    Schedule Now
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