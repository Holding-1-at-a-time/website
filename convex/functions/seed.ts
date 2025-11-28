import { mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { getCurrentUser, handleConvexError } from "../auth";

// Initial service data from the existing static data
const initialServices = [
  {
    name: "Auto Detailing",
    slug: "auto-detailing",
    category: "primary" as const,
    title: "IDA Certified Auto Detailing in San Antonio, TX | One Detail At A Time",
    description: "Premium Auto detailing services in San Antonio. Expert car detailing, paint protection & interior deep cleanse. Licensed, insured & certified pro. Drop off your vehicle at our studio or opt for our valet service.",
    metaDescription: "Premium IDA certified auto detailing in San Antonio, TX. Expert car care including paint protection, interior deep cleaning, and ceramic coating. Drop off at our studio or ask about our valet service. Free quotes!",
    features: [
      "Complete exterior hand wash and dry",
      "Interior vacuuming and shampooing",
      "Engine bay detailing",
      "Paint correction and protection",
      "Wheel and tire cleaning",
      "Headlight restoration"
    ],
    benefits: [
      "IDA certified professional detailers",
      "Valet service available for an additional $50",
      "Eco-friendly products",
      "Licensed and insured",
      "Satisfaction guaranteed"
    ],
    price: "$199+",
    duration: "3-4 hours",
    process: [
      {
        step: 1,
        title: "Inspection & Assessment",
        description: "Thorough inspection of your vehicle to identify specific needs and problem areas"
      },
      {
        step: 2,
        title: "Deep Cleaning",
        description: "Complete interior and exterior cleaning using professional-grade products"
      },
      {
        step: 3,
        title: "Paint Correction",
        description: "Remove swirls, scratches, and oxidation to restore paint clarity"
      },
      {
        step: 4,
        title: "Protection & Finishing",
        description: "Apply protective coatings and final touches for lasting results"
      }
    ]
  },
  {
    name: "Auto Interior Vacuuming",
    slug: "auto-interior-vacuuming",
    category: "primary" as const,
    title: "IDA Certified Auto Interior Vacuuming San Antonio, TX | One Detail At A Time",
    description: "Professional car vacuuming in San Antonio. Expert carpet cleaning, upholstery vacuuming & debris removal. Drop off your vehicle at our studio or opt for our valet service. Free quotes today!",
    metaDescription: "Expert auto interior vacuuming service in San Antonio. Deep carpet cleaning, upholstery care, and complete debris removal. Valet service available. Drop off at our studio. IDA certified professionals.",
    features: [
      "High-powered vacuum system",
      "Carpet and upholstery deep cleaning",
      "Under-seat debris removal",
      "Floor mat cleaning",
      "Trunk vacuuming",
      "Crevice tool detailing"
    ],
    benefits: [
      "Valet service available for an additional $50",
      "Removes embedded dirt and allergens",
      "Improves air quality",
      "Extends interior lifespan",
      "Professional equipment",
      "Thorough and meticulous"
    ],
    price: "$49+",
    duration: "30-45 minutes",
    process: [
      {
        step: 1,
        title: "Pre-Inspection",
        description: "Identify heavy soil areas and specific cleaning needs"
      },
      {
        step: 2,
        title: "Deep Vacuuming",
        description: "Use industrial vacuum to extract all debris from carpets and seats"
      },
      {
        step: 3,
        title: "Crevice Cleaning",
        description: "Detail hard-to-reach areas with specialized attachments"
      },
      {
        step: 4,
        title: "Final Inspection",
        description: "Ensure complete cleanliness throughout interior"
      }
    ]
  },
  {
    name: "Car Waxing",
    slug: "car-waxing",
    category: "primary" as const,
    title: "IDA Certified Car Waxing & Auto Detailing San Antonio, TX | One Detail At A Time",
    description: "Professional waxing services in San Antonio. Expert hand wax, paint protection & shine restoration. Drop off your vehicle at our studio or opt for our valet service. Licensed & insured. Free quotes today!",
    metaDescription: "Premium car waxing service in San Antonio, TX. Expert hand wax application, paint protection, and shine restoration. Valet service available. Drop off at our studio. IDA certified.",
    features: [
      "Premium carnauba wax application",
      "Paint decontamination before waxing",
      "Hand application for even coverage",
      "UV protection",
      "Water-beading finish",
      "3-4 month protection"
    ],
    benefits: [
      "Valet service available for an additional $50",
      "Deep, wet-look shine",
      "Protects against UV damage",
      "Repels water and contaminants",
      "Enhances resale value",
      "Long-lasting results"
    ],
    price: "$89+",
    duration: "1-2 hours",
    process: [
      {
        step: 1,
        title: "Surface Preparation",
        description: "Wash and decontaminate paint surface"
      },
      {
        step: 2,
        title: "Paint Inspection",
        description: "Check for defects that may need correction"
      },
      {
        step: 3,
        title: "Wax Application",
        description: "Apply premium wax by hand in circular motions"
      },
      {
        step: 4,
        title: "Buffing & Finishing",
        description: "Buff to high shine and inspect final results"
      }
    ]
  },
  {
    name: "Clay Bar Treatment",
    slug: "clay-bar-treatment",
    category: "primary" as const,
    title: "IDA Certified Clay Bar Treatment San Antonio, TX | One Detail At A Time",
    description: "Professional clay bar treatment in San Antonio. Expert contaminant removal, smooth finish & paint prep. Drop off your vehicle at our studio or opt for our valet service. Licensed & insured. Free quotes!",
    metaDescription: "Expert clay bar treatment in San Antonio, TX. Remove embedded contaminants, overspray, and bonded particles. Smooth glass-like finish. Valet service available. Drop off at our studio. IDA certified detailers.",
    features: [
      "Premium clay bar system",
      "Removes bonded contaminants",
      "Eliminates overspray and rail dust",
      "Safe for all paint types",
      "Glass-smooth finish",
      "Paint correction prep"
    ],
    benefits: [
      "Valet service available for an additional $50",
      "Restores smooth paint surface",
      "Removes what washing can't",
      "Prepares for wax or coating",
      "Improves paint clarity",
      "Essential for detailing"
    ],
    price: "$79+",
    duration: "1-1.5 hours",
    process: [
      {
        step: 1,
        title: "Paint Washing",
        description: "Clean surface to remove loose dirt"
      },
      {
        step: 2,
        title: "Lubrication",
        description: "Apply clay bar lubricant to work area"
      },
      {
        step: 3,
        title: "Clay Bar Application",
        description: "Glide clay bar over surface to remove contaminants"
      },
      {
        step: 4,
        title: "Wipe Down",
        description: "Remove residue and inspect smooth finish"
      }
    ]
  },
  {
    name: "Engine Detailing",
    slug: "engine-detailing",
    category: "primary" as const,
    title: "IDA Certified Engine Detailing San Antonio, TX | One Detail At A Time",
    description: "Professional engine bay cleaning & detailing in San Antonio. Expert degreasing, steam cleaning & protection. Drop off your vehicle at our studio or opt for our valet service. Free quotes!",
    metaDescription: "Expert engine detailing in San Antonio, TX. Safe degreasing, steam cleaning, and protective dressing. Valet service available. Drop off at our studio. IDA certified professionals.",
    features: [
      "Safe degreasing process",
      "Steam cleaning technology",
      "Protective dressing application",
      "Hose and belt treatment",
      "Cover and reservoir cleaning",
      "Plastic and rubber restoration"
    ],
    benefits: [
      "Valet service available for an additional $50",
      "Easier leak detection",
      "Better engine cooling",
      "Prevents corrosion",
      "Increases resale value",
      "Professional appearance"
    ],
    price: "$99+",
    duration: "1-2 hours",
    process: [
      {
        step: 1,
        title: "Protection",
        description: "Cover sensitive electrical components"
      },
      {
        step: 2,
        title: "Degreasing",
        description: "Apply professional degreaser to break down grime"
      },
      {
        step: 3,
        title: "Steam Cleaning",
        description: "Use steam to safely remove dirt and degreaser"
      },
      {
        step: 4,
        title: "Dressing",
        description: "Apply protective dressing to plastics and rubber"
      }
    ]
  },
  {
    name: "Full Body Wash",
    slug: "full-body-wash",
    category: "primary" as const,
    title: "IDA Certified Full Body Wash & Auto Detailing San Antonio, TX | One Detail At A Time",
    description: "Professional exterior car washing in San Antonio. Expert hand wash, foam bath & spot-free rinse. Drop off your vehicle at our studio or opt for our valet service. Free quotes today!",
    metaDescription: "Premium full body wash service in San Antonio, TX. Hand wash, foam bath, spot-free rinse, and tire shine. Valet detailing available. Drop off at our studio. IDA certified professionals.",
    features: [
      "pH-balanced car shampoo",
      "Two-bucket wash method",
      "Foam cannon pre-wash",
      "Wheel and tire cleaning",
      "Spot-free rinse",
      "Microfiber towel dry"
    ],
    benefits: [
      "Valet service available for an additional $50",
      "Scratch-free washing technique",
      "Removes dirt safely",
      "Prevents water spots",
      "Maintains paint health",
      "Quick and convenient"
    ],
    price: "$59+",
    duration: "45-60 minutes",
    process: [
      {
        step: 1,
        title: "Pre-Rinse",
        description: "Foam cannon pre-wash to loosen dirt"
      },
      {
        step: 2,
        title: "Hand Wash",
        description: "Two-bucket method with premium mitt"
      },
      {
        step: 3,
        title: "Wheel Cleaning",
        description: "Dedicated wheel cleaner and brushes"
      },
      {
        step: 4,
        title: "Dry & Shine",
        description: "Spot-free rinse and microfiber drying"
      }
    ]
  }
];

// Seed database with initial data
export const seedDatabase = mutation(async (ctx) => {
  try {
    // Check if this is being called by an admin
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can seed the database");
    }

    // Check if data already exists
    const existingServices = await ctx.db.query("services").collect();
    if (existingServices.length > 0) {
      throw new ConvexError("Database already contains data. Seeding skipped.");
    }

    console.log("Starting database seeding...");

    // Create services
    console.log("Creating services...");
    for (const serviceData of initialServices) {
      const serviceId = await ctx.db.insert("services", {
        ...serviceData,
        isActive: true,
        sortOrder: initialServices.indexOf(serviceData),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log(`Created service: ${serviceData.name} (ID: ${serviceId})`);
    }

    // Create admin user (if not exists)
    console.log("Creating admin user...");
    const existingAdmins = await ctx.db
      .query("adminUsers")
      .filter((q: any) => q.eq(q.field("email"), "admin@1detailatatime.com"))
      .collect();

    if (existingAdmins.length === 0) {
      const adminUserId = await ctx.db.insert("adminUsers", {
        userId: "admin_demo",
        email: "admin@1detailatatime.com",
        name: "Business Owner",
        role: "admin" as const,
        permissions: [
          "bookings:read", "bookings:write", "bookings:delete",
          "customers:read", "customers:write",
          "services:read", "services:write",
          "reviews:read", "reviews:write", "reviews:moderate",
          "admin:manage", "settings:manage"
        ],
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      console.log(`Created admin user: admin@1detailatatime.com (ID: ${adminUserId})`);
    }

    // Create business settings (if not exists)
    console.log("Creating business settings...");
    const existingSettings = await ctx.db.query("businessSettings").collect();
    if (existingSettings.length === 0) {
      const settings = [
        { key: "business_name", value: "One Detail At A Time LLC", description: "Official business name" },
        { key: "business_phone", value: "(726) 207-1007", description: "Primary business phone number" },
        { key: "business_email", value: "rromerojr1@gmail.com", description: "Primary business email" },
        { key: "business_address", value: "11692 Bricken Circle, San Antonio, TX 78233", description: "Business address" },
        { key: "booking_advance_days", value: "30", description: "Maximum days in advance for booking" },
        { key: "valet_service_fee", value: "50", description: "Additional fee for valet service in dollars" },
        { key: "business_hours_start", value: "7", description: "Business hours start time (24-hour format)" },
        { key: "business_hours_end", value: "22", description: "Business hours end time (24-hour format)" },
      ];

      for (const setting of settings) {
        await ctx.db.insert("businessSettings", {
          key: setting.key,
          value: setting.value,
          description: setting.description,
          updatedAt: Date.now(),
          updatedBy: "admin_demo",
        });
        console.log(`Created setting: ${setting.key} = ${setting.value}`);
      }
    }

    console.log("Database seeding completed successfully!");
    
    return {
      success: true,
      message: "Database seeded successfully with initial data",
      createdServices: initialServices.length,
      createdAdmin: existingAdmins.length === 0,
      createdSettings: existingSettings.length === 0,
    };
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});

// Reset database (admin only) - deletes all data
export const resetDatabase = mutation(async (ctx) => {
  try {
    // Check if this is being called by an admin
    const user = await getCurrentUser(ctx);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Only admins can reset the database");
    }

    console.log("Starting database reset...");

    // Delete all data in reverse order to handle dependencies
    const sessions = await ctx.db.query("sessions").collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }
    console.log(`Deleted ${sessions.length} sessions`);

    const activityLogs = await ctx.db.query("activityLog").collect();
    for (const log of activityLogs) {
      await ctx.db.delete(log._id);
    }
    console.log(`Deleted ${activityLogs.length} activity logs`);

    const bookings = await ctx.db.query("bookings").collect();
    for (const booking of bookings) {
      await ctx.db.delete(booking._id);
    }
    console.log(`Deleted ${bookings.length} bookings`);

    const reviews = await ctx.db.query("reviews").collect();
    for (const review of reviews) {
      await ctx.db.delete(review._id);
    }
    console.log(`Deleted ${reviews.length} reviews`);

    const customers = await ctx.db.query("customers").collect();
    for (const customer of customers) {
      await ctx.db.delete(customer._id);
    }
    console.log(`Deleted ${customers.length} customers`);

    const services = await ctx.db.query("services").collect();
    for (const service of services) {
      await ctx.db.delete(service._id);
    }
    console.log(`Deleted ${services.length} services`);

    const businessSettings = await ctx.db.query("businessSettings").collect();
    for (const setting of businessSettings) {
      await ctx.db.delete(setting._id);
    }
    console.log(`Deleted ${businessSettings.length} business settings`);

    const adminUsers = await ctx.db.query("adminUsers").collect();
    for (const admin of adminUsers) {
      await ctx.db.delete(admin._id);
    }
    console.log(`Deleted ${adminUsers.length} admin users`);

    console.log("Database reset completed.");
    
    return {
      success: true,
      message: "Database reset completed successfully",
      deletedCounts: {
        sessions: sessions.length,
        activityLogs: activityLogs.length,
        bookings: bookings.length,
        reviews: reviews.length,
        customers: customers.length,
        services: services.length,
        businessSettings: businessSettings.length,
        adminUsers: adminUsers.length,
      }
    };
  } catch (error) {
    throw new ConvexError(handleConvexError(error));
  }
});
