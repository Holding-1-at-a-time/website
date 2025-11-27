import { Service } from '@/types/index'
import { BUSINESS_INFO } from './business-info'

/**
 * Generate comprehensive Service schema for auto detailing services
 */
export function generateServiceSchema(service: Service) {
  const baseUrl = 'https://1detailatatime.com'
  
  // Extract numeric price for schema (remove $ and + signs)
  const priceValue = parseInt(service.price.replace(/[$,+]/g, ''))
  
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services/${service.slug}#service`,
    "name": service.name,
    "description": service.description,
    "url": `${baseUrl}/services/${service.slug}`,
    "provider": {
      "@id": `${baseUrl}#business`
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "San Antonio",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      ...BUSINESS_INFO.serviceAreas.map(area => ({
        "@type": "Place",
        "name": area
      }))
    ],
    "serviceType": getServiceType(service.name),
    "category": "Auto Detailing Service",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${service.name} Service`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.name
          },
          "price": priceValue,
          "priceCurrency": "USD",
          "priceValidUntil": "2025-12-31",
          "availability": "https://schema.org/InStock",
          "eligibleCustomerType": "https://schema.org/BusinessConsumer",
          "eligibleQuantity": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 1,
            "unitCode": "EACH"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": getReviewCountForService(service.name),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": getServiceReviews(service.name),
    "offers": {
      "@type": "Offer",
      "price": priceValue,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01",
      "validThrough": "2025-12-31",
      "seller": {
        "@id": `${baseUrl}#business`
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Duration",
        "value": service.duration
      },
      {
        "@type": "PropertyValue", 
        "name": "Valet Service Available",
        "value": "Yes, $50 additional fee"
      },
      {
        "@type": "PropertyValue",
        "name": "IDA Certified",
        "value": "Yes"
      },
      {
        "@type": "PropertyValue",
        "name": "Licensed & Insured",
        "value": "Yes"
      }
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": `${baseUrl}/booking`,
      "result": {
        "@type": "Reservation",
        "name": `${service.name} Reservation`
      }
    }
  }
}

/**
 * Generate FAQ schema for auto detailing services
 */
export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How quickly can you respond to my request?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We typically respond to all inquiries within 2-4 hours during business hours, and within 24 hours on weekends or holidays."
        }
      },
      {
        "@type": "Question", 
        "name": "Do you offer a valet service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! For an added cost of $50, we will pick up and drop off your vehicle at any location and destination stated by you."
        }
      },
      {
        "@type": "Question",
        "name": "What's included in your free quote?",
        "acceptedAnswer": {
          "@type": "Answer", 
          "text": "Our free quote includes detailed pricing based on your vehicle type, service needs, and current condition, plus service time estimates."
        }
      },
      {
        "@type": "Question",
        "name": "Are you licensed and insured?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we are fully licensed, insured, and IDA certified. Your vehicle and property are fully protected during our service."
        }
      },
      {
        "@type": "Question",
        "name": "What areas do you serve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We serve San Antonio, TX and surrounding areas including Stone Oak, Alamo Heights, North Side, Medical Center, and Downtown."
        }
      },
      {
        "@type": "Question",
        "name": "What are your business hours?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Monday: Closed, Tuesday - Sunday: 7:00 AM - 10:00 PM. Emergency service available by appointment."
        }
      }
    ]
  }
}

/**
 * Generate breadcrumb schema for navigation
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  }
}

/**
 * Generate review schema for customer testimonials
 */
export function generateReviewSchema(reviews: Array<{name: string, rating: number, comment: string, date: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": reviews.map((review, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating.toString(),
          "bestRating": "5",
          "worstRating": "1"
        },
        "author": {
          "@type": "Person",
          "name": review.name
        },
        "reviewBody": review.comment,
        "datePublished": review.date,
        "publisher": {
          "@id": "https://1detailatatime.com#business"
        }
      }
    }))
  }
}

/**
 * Generate aggregate rating schema
 */
export function generateAggregateRatingSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "25",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "25"
  }
}

/**
 * Get service type for schema
 */
function getServiceType(serviceName: string): string {
  const serviceTypes: Record<string, string> = {
    "Auto Detailing": "Auto Detailing Service",
    "Auto Interior Vacuuming": "Interior Cleaning Service", 
    "Car Waxing": "Automotive Care Service",
    "Clay Bar Treatment": "Paint Correction Service",
    "Engine Detailing": "Engine Cleaning Service",
    "Full Body Wash": "Car Wash Service",
    "Headlight Polishing": "Automotive Restoration Service",
    "Interior Scenting": "Automotive Interior Service",
    "Paint Repair": "Paint Correction Service",
    "Seat Shampooing": "Upholstery Cleaning Service",
    "Steam Cleaning": "Deep Cleaning Service",
    "Wheel Washing": "Automotive Care Service",
    "Car Wash": "Car Wash Service",
    "Full Detail Package": "Complete Auto Detailing Service"
  }
  
  return serviceTypes[serviceName] || "Automotive Service"
}

/**
 * Get review count for specific service
 */
function getReviewCountForService(serviceName: string): number {
  const reviewCounts: Record<string, number> = {
    "Auto Detailing": 8,
    "Full Detail Package": 1,
    "Headlight Polishing": 1,
    "Seat Shampooing": 1,
    "Engine Detailing": 1,
    "Paint Repair": 1,
    "Steam Cleaning": 1,
    "Car Wash": 1,
    "Auto Interior Vacuuming": 0,
    "Car Waxing": 0,
    "Clay Bar Treatment": 0,
    "Full Body Wash": 0,
    "Interior Scenting": 0,
    "Wheel Washing": 0
  }
  
  return reviewCounts[serviceName] || 1
}

/**
 * Get service reviews
 */
function getServiceReviews(serviceName: string) {
  const serviceReviews: Record<string, Array<{name: string, rating: number, comment: string, date: string}>> = {
    "Auto Detailing": [
      {
        "name": "Jennifer Williams",
        "rating": 5,
        "comment": "The ceramic coating was worth every penny. Water beads right off, and my car still looks freshly detailed weeks later. Highly recommend!",
        "date": "2024-11-01"
      }
    ],
    "Full Detail Package": [
      {
        "name": "Michael Rodriguez", 
        "rating": 5,
        "comment": "Outstanding service! My car looks brand new. The attention to detail is incredible, and the team was professional and on time. Best detailing I've ever had in San Antonio.",
        "date": "2024-11-15"
      }
    ],
    "Headlight Polishing": [
      {
        "name": "Sarah Johnson",
        "rating": 5,
        "comment": "The headlight restoration made a huge difference! I can actually see at night now. Great work and very affordable compared to dealership prices.",
        "date": "2024-11-10"
      }
    ],
    "Seat Shampooing": [
      {
        "name": "David Martinez",
        "rating": 5,
        "comment": "IDA certification really shows in their work. They got out stains I thought were permanent. Valet service was super convenient - they picked up my car from my office!",
        "date": "2024-11-05"
      }
    ],
    "Engine Detailing": [
      {
        "name": "Carlos Hernandez",
        "rating": 5,
        "comment": "Best engine detailing in San Antonio! They took their time and made my engine bay look showroom quality. Very professional team.",
        "date": "2024-10-28"
      }
    ],
    "Paint Repair": [
      {
        "name": "Amanda Thompson", 
        "rating": 5,
        "comment": "The paint correction removed years of swirls and scratches. My black car finally has that mirror finish! Worth the investment.",
        "date": "2024-10-20"
      }
    ],
    "Steam Cleaning": [
      {
        "name": "Robert Garcia",
        "rating": 5,
        "comment": "Steam cleaning was amazing - chemical-free and my interior has never been cleaner. Perfect for families with kids and pets.",
        "date": "2024-10-15"
      }
    ],
    "Car Wash": [
      {
        "name": "Lisa Anderson",
        "rating": 5,
        "comment": "Quick, affordable, and they picked up my car from my house! The valet car wash service is so convenient. Will definitely use again.",
        "date": "2024-10-10"
      }
    ]
  }
  
  return serviceReviews[serviceName] || []
}