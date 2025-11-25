import { Service, Review } from "@/lib/index";

export const services: Service[] = [
    {
        id: "1",
        name: "Auto Detailing",
        slug: "auto-detailing",
        category: "primary",
        title: "IDA Certified Auto Detailing in San Antonio, TX | One Detail At A Time",
        description: "Premium Auto detailing services for San Antonio residents. Expert car detailing, paint protection & interior deep cleanse. Licensed, insured & certified pro",
        metaDescription: "Premium IDA certified auto detailing in San Antonio, TX. Expert car care including paint protection, interior deep cleaning, and ceramic coating. Serving Stone Oak, Alamo Heights, and North Side SA. Free quotes!",
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
            "Mobile service - we come to you",
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
        id: "2",
        name: "Auto Interior Vacuuming",
        slug: "auto-interior-vacuuming",
        category: "primary",
        title: "IDA Certified Auto Interior Vacuuming San Antonio, TX | One Detail At A Time",
        description: "Professional car vacuuming for San Antonio vehicles. Expert carpet cleaning, upholstery vacuuming & debris removal. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Free quotes today!",
        metaDescription: "Expert auto interior vacuuming service in San Antonio. Deep carpet cleaning, upholstery care, and complete debris removal. Mobile service available throughout San Antonio, TX. IDA certified professionals.",
        features: [
            "High-powered vacuum system",
            "Carpet and upholstery deep cleaning",
            "Under-seat debris removal",
            "Floor mat cleaning",
            "Trunk vacuuming",
            "Crevice tool detailing"
        ],
        benefits: [
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
        id: "3",
        name: "Car Waxing",
        slug: "car-waxing",
        category: "primary",
        title: "IDA Certified Car Waxing & Auto Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional mobile waxing services for San Antonio vehicles. Expert hand wax, paint protection & shine restoration. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Licensed & insured. Free quotes today!",
        metaDescription: "Premium car waxing service in San Antonio, TX. Expert hand wax application, paint protection, and shine restoration. Mobile service throughout Stone Oak, Alamo Heights, and all SA areas. IDA certified.",
        features: [
            "Premium carnauba wax application",
            "Paint decontamination before waxing",
            "Hand application for even coverage",
            "UV protection",
            "Water-beading finish",
            "3-4 month protection"
        ],
        benefits: [
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
        id: "4",
        name: "Clay Bar Treatment",
        slug: "clay-bar-treatment",
        category: "primary",
        title: "IDA Certified Clay Bar Treatment San Antonio, TX | One Detail At A Time",
        description: "Professional clay bar treatment for San Antonio vehicles. Expert contaminant removal, smooth finish & paint prep. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Licensed & insured. Free quotes!",
        metaDescription: "Expert clay bar treatment in San Antonio, TX. Remove embedded contaminants, overspray, and bonded particles. Smooth glass-like finish. Mobile service available. IDA certified detailers.",
        features: [
            "Premium clay bar system",
            "Removes bonded contaminants",
            "Eliminates overspray and rail dust",
            "Safe for all paint types",
            "Glass-smooth finish",
            "Paint correction prep"
        ],
        benefits: [
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
        id: "5",
        name: "Engine Detailing",
        slug: "engine-detailing",
        category: "primary",
        title: "IDA Certified Engine Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional engine bay cleaning & detailing for San Antonio vehicles. Expert degreasing, steam cleaning & protection. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Mobile service available. Free quotes!",
        metaDescription: "Expert engine detailing in San Antonio, TX. Safe degreasing, steam cleaning, and protective dressing. Mobile service for all San Antonio areas. IDA certified professionals.",
        features: [
            "Safe degreasing process",
            "Steam cleaning technology",
            "Protective dressing application",
            "Hose and belt treatment",
            "Cover and reservoir cleaning",
            "Plastic and rubber restoration"
        ],
        benefits: [
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
        id: "6",
        name: "Full Body Wash",
        slug: "full-body-wash",
        category: "primary",
        title: "IDA Certified Full Body Wash & Auto Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional exterior car washing for San Antonio vehicles. Expert hand wash, foam bath & spot-free rinse. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Mobile service. Free quotes today!",
        metaDescription: "Premium full body wash service in San Antonio, TX. Hand wash, foam bath, spot-free rinse, and tire shine. Mobile detailing throughout San Antonio. IDA certified professionals.",
        features: [
            "pH-balanced car shampoo",
            "Two-bucket wash method",
            "Foam cannon pre-wash",
            "Wheel and tire cleaning",
            "Spot-free rinse",
            "Microfiber towel dry"
        ],
        benefits: [
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
    },
    {
        id: "7",
        name: "Headlight Polishing",
        slug: "headlight-polishing",
        category: "primary",
        title: "IDA Certified Headlight Restoration San Antonio, TX | One Detail At A Time",
        description: "Professional headlight polishing & cleaning for San Antonio vehicles. Expert oxidation removal, UV protection & clarity restoration. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Free quotes!",
        metaDescription: "Expert headlight restoration in San Antonio, TX. Remove oxidation and yellowing, restore clarity, apply UV protection. Mobile service available. IDA certified detailers.",
        features: [
            "Oxidation removal",
            "Multi-stage polishing",
            "UV protective coating",
            "Both headlights included",
            "Wet-sanding when needed",
            "Clear coat application"
        ],
        benefits: [
            "Dramatically improves visibility",
            "Safer night driving",
            "Restores like-new appearance",
            "Prevents further yellowing",
            "More affordable than replacement"
        ],
        price: "$79+",
        duration: "45-60 minutes",
        process: [
            {
                step: 1,
                title: "Assessment",
                description: "Evaluate oxidation level and damage"
            },
            {
                step: 2,
                title: "Sanding",
                description: "Wet-sand headlight surface if needed"
            },
            {
                step: 3,
                title: "Polishing",
                description: "Multi-stage polish to restore clarity"
            },
            {
                step: 4,
                title: "UV Coating",
                description: "Apply protective clear coat for longevity"
            }
        ]
    },
    {
        id: "8",
        name: "Interior Scenting",
        slug: "interior-scenting",
        category: "primary",
        title: "IDA Certified Interior Scenting & Auto Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional car interior freshening for San Antonio vehicles. Expert odor elimination, air freshening & scent application. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Free quotes!",
        metaDescription: "Expert interior scenting service in San Antonio, TX. Eliminate odors, freshen air, and apply long-lasting fragrances. Mobile detailing throughout San Antonio. IDA certified.",
        features: [
            "Odor elimination treatment",
            "Ozone treatment option",
            "Premium fragrance selection",
            "Air vent fresheners",
            "Carpet deodorizing",
            "Long-lasting scents"
        ],
        benefits: [
            "Removes stubborn odors",
            "Pleasant driving experience",
            "Multiple scent options",
            "Lasts 2-3 months",
            "Professional grade products"
        ],
        price: "$39+",
        duration: "15-30 minutes",
        process: [
            {
                step: 1,
                title: "Odor Assessment",
                description: "Identify source and type of odors"
            },
            {
                step: 2,
                title: "Odor Elimination",
                description: "Apply odor neutralizer or ozone treatment"
            },
            {
                step: 3,
                title: "Scent Selection",
                description: "Choose from premium fragrance options"
            },
            {
                step: 4,
                title: "Application",
                description: "Apply scent to vents and interior surfaces"
            }
        ]
    },
    {
        id: "9",
        name: "Paint Repair",
        slug: "paint-repair",
        category: "primary",
        title: "IDA Certified Paint Correction & Repair San Antonio, TX | One Detail At A Time",
        description: "Professional paint repair for San Antonio vehicles. Expert scratch removal, chip repair & paint restoration. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Free quotes today!",
        metaDescription: "Expert paint correction and repair in San Antonio, TX. Remove scratches, swirls, oxidation, and chips. Restore factory finish. Mobile service available. IDA certified professionals.",
        features: [
            "Multi-stage paint correction",
            "Scratch and swirl removal",
            "Chip touch-up",
            "Wet-sanding technique",
            "Machine polishing",
            "Paint sealant application"
        ],
        benefits: [
            "Restores paint depth and gloss",
            "Removes years of damage",
            "Professional results",
            "Increases vehicle value",
            "Long-lasting finish"
        ],
        price: "$299+",
        duration: "4-8 hours",
        process: [
            {
                step: 1,
                title: "Paint Inspection",
                description: "Assess damage with paint depth gauge"
            },
            {
                step: 2,
                title: "Compounding",
                description: "Remove heavy defects with cutting compound"
            },
            {
                step: 3,
                title: "Polishing",
                description: "Multi-stage polish to refine finish"
            },
            {
                step: 4,
                title: "Protection",
                description: "Apply sealant or ceramic coating"
            }
        ]
    },
    {
        id: "10",
        name: "Seat Shampooing",
        slug: "seat-shampooing",
        category: "primary",
        title: "IDA Certified Seat Shampooing & Interior Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional upholstery cleaning for San Antonio vehicles. Expert stain removal, deep cleaning & fabric protection. Serving Stone Oak, Alamo Heights, North Side & all SA areas.",
        metaDescription: "Expert seat shampooing and upholstery cleaning in San Antonio, TX. Remove stains, odors, and deep-set dirt. Fabric protection available. Mobile service. IDA certified.",
        features: [
            "Hot water extraction",
            "Professional upholstery cleaner",
            "Stain removal treatment",
            "Leather conditioning (if applicable)",
            "Fabric protection option",
            "Fast-drying equipment"
        ],
        benefits: [
            "Removes stains and odors",
            "Restores fabric appearance",
            "Healthier interior environment",
            "Extends seat life",
            "Fresh, clean smell"
        ],
        price: "$89+",
        duration: "1.5-2 hours",
        process: [
            {
                step: 1,
                title: "Pre-Treatment",
                description: "Apply stain remover to problem areas"
            },
            {
                step: 2,
                title: "Shampooing",
                description: "Deep clean with upholstery shampoo"
            },
            {
                step: 3,
                title: "Extraction",
                description: "Hot water extraction to remove dirt and cleaner"
            },
            {
                step: 4,
                title: "Drying & Protection",
                description: "Quick-dry and apply fabric protectant"
            }
        ]
    },
    {
        id: "11",
        name: "Steam Cleaning",
        slug: "steam-cleaning",
        category: "primary",
        title: "IDA Certified Steam Cleaning & Auto Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional steam cleaning for San Antonio vehicles. Expert sanitization, deep cleaning & chemical-free detailing. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Free quotes!",
        metaDescription: "Expert steam cleaning service in San Antonio, TX. Chemical-free deep cleaning and sanitization for interior and exterior. Mobile service throughout San Antonio. IDA certified.",
        features: [
            "High-temperature steam",
            "Chemical-free cleaning",
            "Sanitizes and disinfects",
            "Interior and exterior capable",
            "Eco-friendly method",
            "Kills bacteria and germs"
        ],
        benefits: [
            "Safe for all surfaces",
            "Environmentally friendly",
            "Deep sanitization",
            "No harsh chemicals",
            "Effective on tough stains"
        ],
        price: "$119+",
        duration: "2-3 hours",
        process: [
            {
                step: 1,
                title: "Preparation",
                description: "Vacuum and prepare surfaces"
            },
            {
                step: 2,
                title: "Steam Application",
                description: "Apply high-temp steam to all surfaces"
            },
            {
                step: 3,
                title: "Agitation",
                description: "Use brushes to work steam into materials"
            },
            {
                step: 4,
                title: "Extraction & Dry",
                description: "Remove moisture and allow to dry"
            }
        ]
    },
    {
        id: "12",
        name: "Wheel Washing",
        slug: "wheel-washing",
        category: "primary",
        title: "IDA Certified Wheel Cleaning & Detailing San Antonio, TX | One Detail At A Time",
        description: "Professional wheel washing for San Antonio vehicles. Expert brake dust removal, rim polishing & tire shine. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Free quotes today!",
        metaDescription: "Expert wheel cleaning and detailing in San Antonio, TX. Remove brake dust, polish rims, shine tires. All wheel types. Mobile service available. IDA certified detailers.",
        features: [
            "Wheel-safe acid-free cleaner",
            "Dedicated wheel brushes",
            "Brake dust removal",
            "Rim polishing",
            "Tire dressing application",
            "Wheel well cleaning"
        ],
        benefits: [
            "Prevents brake dust buildup",
            "Protects wheel finish",
            "Enhances appearance",
            "Long-lasting shine",
            "Safe for all wheel types"
        ],
        price: "$49+",
        duration: "30-45 minutes",
        process: [
            {
                step: 1,
                title: "Pre-Spray",
                description: "Apply wheel cleaner to loosen brake dust"
            },
            {
                step: 2,
                title: "Brush Agitation",
                description: "Use specialized brushes for spokes and barrel"
            },
            {
                step: 3,
                title: "Rinse",
                description: "Thoroughly rinse all cleaner and dirt"
            },
            {
                step: 4,
                title: "Dress Tires",
                description: "Apply tire shine for finishing touch"
            }
        ]
    },
    {
        id: "13",
        name: "Car Wash",
        slug: "car-wash",
        category: "additional",
        title: "IDA Certified Car Wash San Antonio, TX | One Detail At A Time",
        description: "Professional car wash service for San Antonio vehicles. Expert exterior cleaning, spot-free rinse & dry. Serving Stone Oak, Alamo Heights, North Side & all SA areas. Mobile service available!",
        metaDescription: "Premium car wash service in San Antonio, TX. Hand wash, foam bath, and spot-free dry. Mobile service throughout San Antonio. Quick, convenient, and affordable. IDA certified.",
        features: [
            "Hand wash technique",
            "Foam pre-wash",
            "Wheel cleaning included",
            "Spot-free rinse",
            "Microfiber drying",
            "Window cleaning"
        ],
        benefits: [
            "Gentle on paint",
            "Convenient mobile service",
            "Professional results",
            "Quick turnaround",
            "Affordable pricing"
        ],
        price: "$39+",
        duration: "30-45 minutes",
        process: [
            {
                step: 1,
                title: "Foam Pre-Wash",
                description: "Apply foam to loosen dirt"
            },
            {
                step: 2,
                title: "Hand Wash",
                description: "Wash with soft microfiber mitts"
            },
            {
                step: 3,
                title: "Rinse",
                description: "Spot-free water rinse"
            },
            {
                step: 4,
                title: "Dry",
                description: "Dry with clean microfiber towels"
            }
        ]
    },
    {
        id: "14",
        name: "Full Detail Package",
        slug: "full-detail-package",
        category: "primary",
        title: "IDA Certified Full Detail Package San Antonio, TX | One Detail At A Time",
        description: "Complete auto detailing package for San Antonio vehicles. Includes interior deep cleaning, exterior detailing, paint correction & protection. Serving all SA areas. Licensed & insured!",
        metaDescription: "Comprehensive full detail package in San Antonio, TX. Complete interior and exterior detailing, paint correction, ceramic coating, and more. Best value for San Antonio residents. IDA certified.",
        features: [
            "Complete interior deep cleaning",
            "Exterior hand wash and dry",
            "Paint correction and polishing",
            "Engine bay detailing",
            "Wheel and tire detail",
            "Headlight restoration",
            "Paint protection or wax",
            "Interior scenting"
        ],
        benefits: [
            "Most comprehensive service",
            "Best value package",
            "Complete vehicle transformation",
            "All services included",
            "Show-car results"
        ],
        price: "$399+",
        duration: "6-8 hours",
        process: [
            {
                step: 1,
                title: "Full Assessment",
                description: "Complete vehicle inspection and documentation"
            },
            {
                step: 2,
                title: "Interior Detailing",
                description: "Deep clean all interior surfaces and materials"
            },
            {
                step: 3,
                title: "Exterior Correction",
                description: "Paint correction, polishing, and decontamination"
            },
            {
                step: 4,
                title: "Protection & Finishing",
                description: "Apply protective coatings and final touches"
            }
        ]
    }
];

export const reviews: Review[] = [
    {
        id: "1",
        name: "Michael Rodriguez",
        rating: 5,
        date: "2024-11-15",
        comment: "Outstanding service! My car looks brand new. The attention to detail is incredible, and the team was professional and on time. Best detailing I've ever had in San Antonio.",
        service: "Full Detail Package"
    },
    {
        id: "2",
        name: "Sarah Johnson",
        rating: 5,
        date: "2024-11-10",
        comment: "The headlight restoration made a huge difference! I can actually see at night now. Great work and very affordable compared to dealership prices.",
        service: "Headlight Polishing"
    },
    {
        id: "3",
        name: "David Martinez",
        rating: 5,
        date: "2024-11-05",
        comment: "IDA certification really shows in their work. They got out stains I thought were permanent. Mobile service was super convenient - they came to my office!",
        service: "Seat Shampooing"
    },
    {
        id: "4",
        name: "Jennifer Williams",
        rating: 5,
        date: "2024-11-01",
        comment: "The ceramic coating was worth every penny. Water beads right off, and my car still looks freshly detailed weeks later. Highly recommend!",
        service: "Auto Detailing"
    },
    {
        id: "5",
        name: "Carlos Hernandez",
        rating: 5,
        date: "2024-10-28",
        comment: "Best engine detailing in San Antonio! They took their time and made my engine bay look showroom quality. Very professional team.",
        service: "Engine Detailing"
    },
    {
        id: "6",
        name: "Amanda Thompson",
        rating: 5,
        date: "2024-10-20",
        comment: "The paint correction removed years of swirls and scratches. My black car finally has that mirror finish! Worth the investment.",
        service: "Paint Repair"
    },
    {
        id: "7",
        name: "Robert Garcia",
        rating: 5,
        date: "2024-10-15",
        comment: "Steam cleaning was amazing - chemical-free and my interior has never been cleaner. Perfect for families with kids and pets.",
        service: "Steam Cleaning"
    },
    {
        id: "8",
        name: "Lisa Anderson",
        rating: 5,
        date: "2024-10-10",
        comment: "Quick, affordable, and they came to my house! The mobile car wash service is so convenient. Will definitely use again.",
        service: "Car Wash"
    }
];

export function getServiceBySlug(slug: string): Service | undefined {
    return services.find(service => service.slug === slug);
}

export function getServicesByCategory(category: 'primary' | 'additional'): Service[] {
    return services.filter(service => service.category === category);
}