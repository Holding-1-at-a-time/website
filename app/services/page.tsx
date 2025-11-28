import type { Metadata } from 'next';
import ServicesClient from './ServicesClient';

// Server-side JSON-LD with secure email handling
const generateJsonLd = () => {
    // Get business email from server-side environment variable
    const businessEmail = process.env.BUSINESS_EMAIL || '';
    
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Auto Detailing Services",
        "description": "Professional auto detailing services throughout San Antonio, TX",
        "provider": {
            "@type": "LocalBusiness",
            "name": "One Detail At A Time",
            "image": "https://1detailatatime.com/logo.png",
            "telephone": "(726) 207-1007",
            "email": businessEmail, // Server-side only - never exposed to client
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
};

// Metadata for SEO optimization
export const metadata: Metadata = {
    title: 'Professional Auto Detailing Services | One Detail At A Time | San Antonio TX',
    description: 'San Antonio\'s premier IDA certified auto detailing studio. Premium ceramic coating, interior detailing, paint correction & more. Serving Stone Oak, Alamo Heights, North Side.',
    keywords: [
        'auto detailing San Antonio',
        'car detailing',
        'ceramic coating San Antonio',
        'paint correction',
        'interior detailing',
        'IDA certified detailing',
        'Stone Oak auto detailing',
        'San Antonio car wash',
        'professional detailing studio',
        'One Detail At A Time'
    ],
    authors: [{ name: 'One Detail At A Time' }],
    creator: 'One Detail At A Time',
    publisher: 'One Detail At A Time',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://1detailatatime.com/services',
        title: 'Professional Auto Detailing Services | One Detail At A Time | San Antonio TX',
        description: 'San Antonio\'s premier IDA certified auto detailing studio. Premium ceramic coating, interior detailing, paint correction & more.',
        siteName: 'One Detail At A Time',
        images: [
            {
                url: 'https://1detailatatime.com/logo.png',
                width: 1200,
                height: 630,
                alt: 'One Detail At A Time - Professional Auto Detailing Services in San Antonio, TX',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Professional Auto Detailing Services | One Detail At A Time | San Antonio TX',
        description: 'San Antonio\'s premier IDA certified auto detailing studio. Premium ceramic coating, interior detailing, paint correction & more.',
        images: ['https://1detailatatime.com/logo.png'],
        creator: '@onedetailatatime',
    },
    alternates: {
        canonical: 'https://1detailatatime.com/services',
    },
};

export default function ServicesPage() {
    const jsonLd = generateJsonLd();
    
    return (
        <>
            {/* Server-side JSON-LD - email never exposed to client bundle */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ServicesClient />
        </>
    );
}