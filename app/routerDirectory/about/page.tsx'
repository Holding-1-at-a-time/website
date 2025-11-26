import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Heart, Shield, Star, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | One Detail At A Time - IDA Certified Auto Detailing",
  description: "Learn about One Detail At A Time, San Antonio's trusted IDA certified auto detailing service. Latino-owned, LGBTQ+ friendly, and committed to excellence.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="py-12 lg:py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              About One Detail At A Time
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional auto detailing services in San Antonio, TX. IDA certified, licensed, insured, and dedicated to excellence.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2019, One Detail At A Time has been serving the San Antonio community with premium auto detailing services. Our commitment to quality and customer satisfaction has made us one of the most trusted detailing services in the area.
                </p>
                <p>
                  As an IDA certified business, we adhere to the highest industry standards for auto detailing. Our team of experienced professionals uses only the best products and techniques to ensure your vehicle receives the care it deserves.
                </p>
                <p>
                  We're proud to be a Latino-owned business and an LGBTQ+ friendly establishment, serving all members of our diverse San Antonio community with respect and excellence.
                </p>
              </div>
            </div>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground">Company Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">IDA Certified</h3>
                <p className="text-sm text-muted-foreground">
                  Professionally certified and trained to industry standards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Star className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Quality Service</h3>
                <p className="text-sm text-muted-foreground">
                  Premium products and meticulous attention to detail
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Mobile Service</h3>
                <p className="text-sm text-muted-foreground">
                  We come to you throughout San Antonio areas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Heart className="h-12 w-12 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Community Focus</h3>
                <p className="text-sm text-muted-foreground">
                  10% of sales support Junior Achievement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Excellence</h3>
                  <p className="text-sm text-muted-foreground">
                    We're committed to delivering exceptional results on every vehicle we detail
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Integrity</h3>
                  <p className="text-sm text-muted-foreground">
                    Honest pricing, transparent processes, and reliable service
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Customer Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Your satisfaction is our priority, from booking to final inspection
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-start gap-4 p-6">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting San Antonio through quality service and charitable giving
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Experience the Difference?</h2>
            <p className="text-lg text-primary-foreground/90">
              Join hundreds of satisfied customers in San Antonio who trust us with their vehicles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/booking">Schedule Service</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-primary bg-primary-foreground" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 