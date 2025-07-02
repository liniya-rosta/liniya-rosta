export interface Product {
    _id: string;
    category: string;
    title: string;
    description: string | null;
    image: string | null;
}

export interface Category {
    _id: string;
    title: string;
    slug?: string;
}

export interface UserFields {
    email: string;
    password: string;
    refreshToken: string;
    role: "admin" | "superadmin";
    __confirmPassword: string;
    displayName: string;
}

export interface UpdatesRequest {
    name?: string;
    email?: string;
    phone?: string;
    status?: 'Новая' | 'В работе' | 'Завершена' | 'Отклонена';
    commentOfManager?: string | null;
}

export interface ContactFields {
    location: string;
    phone1: string;
    phone2?: string;
    email: string;
    workingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    mapLocation: string;
    linkLocation: string;
    instagram: string;
    whatsapp: string;
}

export interface PortfolioUpdate{
    cover?: string;
    description?: string;
    coverAlt?: string;
}

export interface ServiceUpdate {
    title?: string;
    description?: string;
}

export interface ImageItem {
    alt?: string;
    image: string;
}

export interface updatePost {
    title?: string;
    description?: string;
    images?: {alt?: string, image: string}[];
}