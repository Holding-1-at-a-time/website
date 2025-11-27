/**
 * Unified Business Information for One Detail At A Time
 * This object serves as the single source of truth for all business details
 * to ensure NAP consistency across the entire website
 */

export const BUSINESS_INFO = {
  // Core Business Information
  name: "One Detail At A Time",
  legalName: "One Detail At A Time LLC",
  phone: "(726) 207-1007",
  email: "rromerojr1@gmail.com",
  
  // Address Information
  address: {
    street: "11692 Bricken Circle",
    city: "San Antonio",
    state: "TX",
    zipCode: "78233",
    country: "US",
    fullAddress: "11692 Bricken Circle, San Antonio, TX 78233"
  },
  
  // Business Hours (Updated to correct operating times)
  hours: {
    monday: { closed: true },
    tuesday: { open: "07:00", close: "22:00" },
    wednesday: { open: "07:00", close: "22:00" },
    thursday: { open: "07:00", close: "22:00" },
    friday: { open: "07:00", close: "22:00" },
    saturday: { open: "07:00", close: "22:00" },
    sunday: { open: "07:00", close: "22:00" }
  },
  
  // Human-readable hours for display
  displayHours: {
    monday: "Closed",
    tuesday: "7:00 AM - 10:00 PM",
    wednesday: "7:00 AM - 10:00 PM",
    thursday: "7:00 AM - 10:00 PM",
    friday: "7:00 AM - 10:00 PM",
    saturday: "7:00 AM - 10:00 PM",
    sunday: "7:00 AM - 10:00 PM"
  },
  
  // Schema.org format for structured data
  schemaHours: [
    "Mo closed",
    "Tu-Sa 07:00-22:00",
    "Su 07:00-22:00"
  ],
  
  // Service Areas (for local SEO)
  serviceAreas: [
    "San Antonio",
    "Stone Oak", 
    "Alamo Heights",
    "North Side",
    "Medical Center",
    "Downtown"
  ],
  
  // Business Categories & Classifications
  categories: {
    primary: "Auto Detailing Service",
    secondary: [
      "Car Wash",
      "Automotive Customization",
      "Auto Cleaning Service",
      "Paint Protection Service"
    ],
    googleMyBusiness: [
      "Auto Detailing",
      "Car Wash Service",
      "Automotive Restoration Service"
    ]
  },
  
  // Certifications & Credentials
  certifications: [
    "IDA Certified",
    "Licensed & Insured"
  ],
  
  // Services
  services: {
    studioBased: true,
    valetAvailable: true,
    valetPrice: "$50",
    sameDayAvailable: true,
    freeQuotes: true,
    professionalStudio: true
  },
  
  // Social Media & Online Presence
  social: {
    website: "https://1detailatatime.com",
    googleMyBusiness: "https://g.page/one-detail-at-a-time"
  },
  
  // Pricing Range (for schema markup)
  priceRange: "$39-$399+"
};

/**
 * Helper function to format phone number for tel: links
 */
export const formatPhoneForTel = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Helper function to get current day hours
 */
export const getTodayHours = (): string => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todayKey = today as keyof typeof BUSINESS_INFO.displayHours;
  return BUSINESS_INFO.displayHours[todayKey] || "Closed";
};

/**
 * Helper function to check if business is currently open
 */
export const isBusinessOpen = (): boolean => {
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const dayKey = currentDay as keyof typeof BUSINESS_INFO.hours;
  const dayHours = BUSINESS_INFO.hours[dayKey];
  
  if ('closed' in dayHours && dayHours.closed) {
    return false;
  }
  
  if ('open' in dayHours && 'close' in dayHours) {
    return currentTime >= dayHours.open && currentTime <= dayHours.close;
  }
  
  return false;
};