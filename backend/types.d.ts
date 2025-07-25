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
    isArchived?: string;
}

export interface WorkingHours {
    monday: {
        ru: string
        ky: string;
    };
    tuesday: {
        ru: string
        ky: string;
    };
    wednesday: {
        ru: string
        ky: string;
    };
    thursday: {
        ru: string
        ky: string;
    };
    friday: {
        ru: string
        ky: string;
    };
    saturday: {
        ru: string
        ky: string;
    };
    sunday: {
        ru: string
        ky: string;
    };
}

export interface ContactFields {
    location: {
        ru: string
        ky: string
    };
    phone1: string;
    phone2?: string;
    email: string;
    workingHours: WorkingHours;
    mapLocation: string;
    linkLocation: string;
    instagram: string;
    whatsapp: string;
}

export interface PortfolioUpdate {
    cover?: string;
    description?: string;
    coverAlt?: string;
}

export interface GalleryUpdate {
    "gallery.$.image"?: string;
    "gallery.$.alt.ru"?: string;
    "gallery.$.alt.ky"?: string;
}


export interface ServiceUpdate {
    title?: {
        ru: string,
        ky: string;
    };
    description?: {
        ru: string,
        ky: string;
    };
}

export interface ImageItem {
    alt?: string;
    image: string;
}

export interface updatePost {
    title?: string;
    description?: string;
    images?: { alt?: string, image: string }[];
    seoTitle?: string;
    seoDescription?: string;
    slug?: string;
}