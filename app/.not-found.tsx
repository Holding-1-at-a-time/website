import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Phone, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// Export metadata for SEO
export const metadata: Metadata = {
  title: "Page Not Found - 404 Error",
  description: "The page you're looking for doesn't exist. Return to One Detail At A Time, San Antonio's premier auto detailing studio.",
  robots: {
    index: false,
    follow: false,
  }
};

// Custom notFound function to avoid Next.js default behavior
export default function NotFound() {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Error Header */}
        <div className="space-y-4">
          <div className="text-8xl font-bold text-muted-foreground mb-4">404</div>
          <h1 className="text-4xl font-bold tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xl text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <Button asChild className="flex items-center gap-2 h-14">
            <Link href="/">
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex items-center gap-2 h-14">
            <Link href="/services">
              <ArrowLeft className="h-5 w-5" />
              Our Services
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex items-center gap-2 h-14">
            <Link href="/contact">
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
          </Button>
        </div>

        {/* Business Information for Local SEO */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Need Auto Detailing Services?</h2>
          <p className="text-muted-foreground">
            Whether you're looking for paint correction, ceramic coating, or complete interior/exterior detailing,
            we're here to help restore your vehicle's showroom condition.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <MapPin className="h-4 w-4 text-primary" />
              <span>11692 Bricken Circle, San Antonio, TX</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Phone className="h-4 w-4 text-primary" />
              <span>(726) 207-1007</span>
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Clock className="h-4 w-4 text-primary" />
              <span>Tue-Sun: 7AM - 10PM</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild>
              <Link href="/booking">Book Now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>
        </div>

        {/* Common Search Terms */}
        <div className="text-xs text-muted-foreground space-y-2">
          <p>Common searches that might help:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/services" className="text-primary hover:underline">auto detailing san antonio</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/services" className="text-primary hover:underline">ceramic coating</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/services" className="text-primary hover:underline">paint correction</Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/services" className="text-primary hover:underline">car detailing</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// Generate static error page (optional for better SEO)
export const dynamic = 'force-static';
