import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BUSINESS_INFO } from "@/lib/business-info";

interface LocalSEOHeroProps {
  variant?: "compact" | "full";
  showPhone?: boolean;
  titleOverride?: string;
  subtitleOverride?: string;
}

/**
 * Local SEO Hero Component
 * 
 * Optimized for "auto detailing near me" searches and local San Antonio queries.
 * Includes location-specific messaging and conversion elements.
 */
export function LocalSEOHero({ 
  variant = "full", 
  showPhone = true,
  titleOverride,
  subtitleOverride 
}: LocalSEOHeroProps) {
  
  const defaultTitle = "Auto Detailing Near You in San Antonio";
  const defaultSubtitle = `Professional mobile and studio auto detailing services throughout San Antonio.
    Serving ${BUSINESS_INFO.serviceAreas.slice(0, 4).join(", ")}, and all surrounding areas.`;
  
  const isCompact = variant === "compact";

  return (
    <section className={`relative ${isCompact ? 'py-12' : 'py-16 lg:py-20'} overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Location Badge */}
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm">
            <MapPin className="w-4 h-4 text-primary mr-2" />
            <span>Serving San Antonio, TX • Professional Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className={`font-bold tracking-tighter ${isCompact 
            ? 'text-2xl sm:text-3xl md:text-4xl' 
            : 'text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'
          }`}>
            {titleOverride || defaultTitle}
          </h1>

          {/* Subtitle */}
          <p className={`max-w-[700px] text-muted-foreground ${isCompact ? 'text-base' : 'text-lg sm:text-xl'}`}>
            {subtitleOverride || defaultSubtitle}
          </p>

          {/* Service Areas Quick List (compact only) */}
          {isCompact && (
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span>Serving:</span>
              {BUSINESS_INFO.serviceAreas.slice(0, 6).map((area: string, index: number) => (
                <span key={area}>
                  {area}
                  {index < Math.min(BUSINESS_INFO.serviceAreas.length, 6) - 1 && ", "}
                </span>
              ))}
              {BUSINESS_INFO.serviceAreas.length > 6 && (
                <span>& more San Antonio areas</span>
              )}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size={isCompact ? "default" : "lg"} asChild className={isCompact ? "" : "text-lg"}>
              <Link href="/booking">
                Book Service Near Me
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            {showPhone && (
              <Button size={isCompact ? "default" : "lg"} variant="outline" asChild className={isCompact ? "" : "text-lg"}>
                <Link href={`tel:${BUSINESS_INFO.phone.replace(/\D/g, '')}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call {BUSINESS_INFO.phone}
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Signals */}
          {!isCompact && (
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Same-Day Service Available</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Studio Service Throughout SA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Free Estimates</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Location-Specific Component for targeting specific San Antonio neighborhoods
 */
interface LocationSpecificProps {
  area: string;
  landmarks?: string[];
}

/**
 * LocalLandmarkSection Component
 * 
 * Targets specific San Antonio areas and landmarks for "auto detailing [area]" searches
 */
export function LocalLandmarkSection({ area, landmarks = [] }: LocationSpecificProps) {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">
            Auto Detailing Services in {area}
          </h3>
          {landmarks.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Convenient to {landmarks.slice(0, 3).join(", ")} and surrounding {area} area
            </p>
          )}
          <div className="flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">
                Check Service Availability in {area}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}