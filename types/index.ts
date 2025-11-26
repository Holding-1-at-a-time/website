export interface Service {
    id: string;
    name: string;
    slug: string;
    category: 'primary' | 'additional';
    title: string;
    description: string;
    metaDescription: string;
    features: string[];
    benefits: string[];
    price: string;
    duration: string;
    process: {
        step: number;
        title: string;
        description: string;
    }[];
}

export interface Review {
    id: string;
    name: string;
    rating: number;
    date: string;
    comment: string;
    service: string;
    avatar?: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
}

export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    vehicleType: string;
    message?: string;
}