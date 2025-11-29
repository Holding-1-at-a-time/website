import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/themeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://1detailatatime.com'),
  title: {
    default: "One Detail At A Time | IDA Certified Auto Detailing San Antonio, TX",
    template: "%s | One Detail At A Time"
  },
  description: "IDA certified auto detailing in San Antonio, TX. Expert car care, paint protection, and interior cleaning services at our detailing studio. Serving Stone Oak, Alamo Heights, North Side and all SA areas.",
  keywords: ["auto detailing", "carwash", "car detailing", "San Antonio", "IDA certified", "paint correction", "ceramic coating", "interior detailing", "Stone Oak", "Alamo Heights"],
  authors: [{ name: "One Detail At A Time LLC" }],
  creator: "One Detail At A Time",
  publisher: "One Detail At A Time",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "One Detail At A Time | IDA Certified Auto Detailing San Antonio",
    description: "Premium auto detailing services in San Antonio, TX. Expert car care at our detailing studio, serving all SA areas.",
    url: "https://1detailatatime.com",
    siteName: "One Detail At A Time",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side LocalBusiness Schema for site-wide SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://1detailatatime.com/#business",
    "name": "One Detail At A Time",
    "alternateName": "One Detail At A Time LLC",
    "url": "https://1detailatatime.com",
    "logo": "https://1detailatatime.com/logo.png",
    "image": "https://1detailatatime.com/logo.png",
    "description": "IDA certified auto detailing studio in San Antonio, TX. Expert car care, paint protection, and interior cleaning services. Serving Stone Oak, Alamo Heights, North Side and all SA areas.",
    "telephone": "(726) 207-1007",
    "email": process.env.BUSINESS_EMAIL || '', // Server-side only - secure email handling
    "priceRange": "$39-$399+",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "11692 Bricken Circle",
      "addressLocality": "San Antonio",
      "addressRegion": "TX",
      "postalCode": "78233",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.4241,
      "longitude": -98.4936
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "San Antonio",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "Stone Oak",
      "Alamo Heights", 
      "North Side",
      "Medical Center",
      "Downtown"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday"],
        "closed": true
      },
      {
        "@type": "OpeningHoursSpecification", 
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "22:00"
      }
    ],
    "serviceType": [
      "Auto Detailing",
      "Car Wash Service", 
      "Paint Protection",
      "Interior Cleaning",
      "Paint Correction",
      "Ceramic Coating"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Auto Detailing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Full Auto Detailing",
            "description": "Complete interior and exterior auto detailing service"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Paint Correction",
            "description": "Professional paint correction and protection services"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "25"
    },
    "servesCuisine": "Auto Detailing",
    "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
    "currenciesAccepted": "USD"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">
              <ErrorBoundary>
                <ConvexClientProvider>
                  {children}
                </ConvexClientProvider>
              </ErrorBoundary>
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}