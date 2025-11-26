import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">One Detail At A Time</h3>
            <p className="text-sm text-muted-foreground mb-4">
              IDA certified auto detailing in San Antonio, TX. Licensed, insured, and serving all SA areas.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <Link href="tel:7262071007" className="hover:text-primary">
                  (726) 207-1007
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <Link href="mailto:rromerojr1@gmail.com" className="hover:text-primary">
                  rromerojr1@gmail.com
                </Link>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>11692 Bricken Circle, San Antonio, TX 78233</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/auto-detailing" className="text-muted-foreground hover:text-primary">
                  Auto Detailing
                </Link>
              </li>
              <li>
                <Link href="/services/paint-repair" className="text-muted-foreground hover:text-primary">
                  Paint Correction
                </Link>
              </li>
              <li>
                <Link href="/services/interior-vacuuming" className="text-muted-foreground hover:text-primary">
                  Interior Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/engine-detailing" className="text-muted-foreground hover:text-primary">
                  Engine Detailing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary hover:underline">
                  View All Services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground hover:text-primary">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Service Areas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Stone Oak</li>
              <li>Alamo Heights</li>
              <li>North Side</li>
              <li>Medical Center</li>
              <li>Downtown</li>
              <li>All San Antonio Areas</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} One Detail At A Time LLC. All rights reserved.</p>
          <p className="mt-2">IDA Certified • Latino-Owned • LGBTQ+ Friendly</p>
        </div>
      </div>
    </footer>
  );
}